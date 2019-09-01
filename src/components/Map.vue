<template>
  <div
    id="viewDiv"
    v-bind:style="{height: mapHeight + 'px', width: mapWidth, marginLeft: mapLeftMargin }"
  >
    <div id="map-btn-grp" class="btn-group" role="group" aria-label="Basic example">
      <button id="basemap-btn" type="button" class="btn btn-primary">
        <img src="../assets/basemaps.png" />
      </button>
      <button id="mapLayers-btn" type="button" class="btn btn-primary">
        <img src="../assets/maplayers4.png" />
      </button>
    </div>
  </div>
</template>

<script>
import { loadModules } from "esri-loader";
import config from "../store/config.json";
import { mapGetters } from "vuex";
import * as Queries from "../js/queries.js";
//import { store } from "../store/store";

const esriBasemapOptions = {
  zoom: 10,
  center: [-93.5, 45]
};

export default {
  name: "Header",
  data() {
    return {
      mapHeight: 0,
      mapWidth: "100%",
      mapLeftMargin: 0,
      esriMods: {},
      identifyResults: [],
      minimizeMap: false
    };
  },
  computed: {
    ...mapGetters({
      result: "getResults"
    })
  },
  watch: {
    result(res) {
      console.log("watch result", res);

      this.processResults(res);
    }
  },
  methods: {
    processResults(res) {
      this.minimizeMap = true;
    },
    handleResize() {
      var headerHeight = document.getElementsByTagName("header")[0]
        .clientHeight;
      this.mapHeight = window.innerHeight - headerHeight;
      this.adjustMapWidth();
    },

    executeIdentifyTask(event) {
      let _this = this;
      // Create identify task for the specified map service
      let identifyTask = new this.esriMods.IdentifyTask(config.MetroGISUrl);

      // Set the parameters for the Identify
      let params = new this.esriMods.IdentifyParameters();
      params.tolerance = 1;
      params.layerIds = [1];
      params.layerOption = "top";
      params.width = config.View.width;
      params.height = config.View.height;
      params.geometry = event.mapPoint;
      params.mapExtent = config.View.extent;

      identifyTask.execute(params).then(function(response) {
        var results = response.results;
        console.log(results);
        if (results.length > 0) {
          _this.identifyResults = results;
          _this.$store.commit("setNewResult", results);
          _this.adjustMapWidth("results");
        } else {
          alert("no results");
        }
      });
    },

    adjustMapWidth(type) {
      let windowWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;

      if (type !== "clear") {
        if (windowWidth > 1400) {
          this.mapWidth = "70%";
          this.mapLeftMargin = "30%";
        } else if (windowWidth > 900 && windowWidth <= 1400) {
          this.mapWidth = "60%";
          this.mapLeftMargin = "40%";
        } else if (windowWidth > 700 && windowWidth <= 900) {
          this.mapWidth = "50%";
          this.mapLeftMargin = "50%";
        } else if (windowWidth <= 700) {
          this.mapWidth = "100%";
          this.mapLeftMargin = "0";
        }
      } else {
        this.mapWidth = "100%";
        this.mapLeftMargin = "0";
      }
    }
  },
  mounted() {
    // detect browser resize
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    let _this = this;

    console.log("map: mounted");
    loadModules(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/OpenStreetMapLayer",
        "esri/layers/MapImageLayer",
        "esri/layers/FeatureLayer",
        "esri/geometry/SpatialReference",
        "esri/tasks/IdentifyTask",
        "esri/tasks/support/IdentifyParameters",
        "esri/tasks/support/Query",
        "esri/tasks/QueryTask"
      ],
      {
        // use a specific version instead of latest 4.x
        url: "https://js.arcgis.com/4.10/"
      }
    ).then(
      ([
        Map,
        MapView,
        OpenStreetMapLayer,
        MapImageLayer,
        FeatureLayer,
        SpatialReference,
        IdentifyTask,
        IdentifyParameters,
        Query,
        QueryTask
      ]) => {
        this.esriMods = {
          Map,
          MapView,
          OpenStreetMapLayer,
          MapImageLayer,
          FeatureLayer,
          SpatialReference,
          IdentifyTask,
          IdentifyParameters,
          Query,
          QueryTask
        };

        Queries.getSchoolDistricts(Query, QueryTask);
        // create map with the given options at a DOM node w/ id 'mapNode'
        var mapLayer = new MapImageLayer({
          url: config.MetroGISUrl,
          sublayers: [
            {
              id: 1,
              visible: true,
              renderer: {
                type: "simple", // autocasts as new SimpleRenderer()
                symbol: {
                  type: "simple-fill", // autocasts as new SimpleFillSymbol()
                  color: [255, 128, 0, 0],
                  outline: {
                    // autocasts as new SimpleLineSymbol()
                    width: 1,
                    color: "purple"
                  }
                }
              }
            }
          ]
        });

        config.Map = new Map({
          basemap: "streets",
          layers: [mapLayer]
        });

        config.View = new MapView({
          container: "viewDiv",
          map: config.Map,
          zoom: esriBasemapOptions.zoom, // Sets zoom level based on level of detail (LOD)
          center: esriBasemapOptions.center // Sets center point of view using longitude,latitude
        });

        config.View.when(function() {
          // executeIdentifyTask() is called each time the view is clicked
          config.View.on("click", _this.executeIdentifyTask);
          //   let identifyTask = new IdentifyTask(
          //     "https://gis2.metc.state.mn.us/arcgis/rest/services/MetroGIS/Land_Ownership/MapServer"
          //   );

          //   // Set the parameters for the Identify
          //   let params = new IdentifyParameters();
          //   params.tolerance = 3;
          //   params.layerIds = [0, 1, 2, 3, 4, 5, 6];
          //   params.layerOption = "top";
          //   params.width = view.width;
          //   params.height = view.height;
          //   params.geometry = event.mapPoint;
          //   params.mapExtent = view.extent;

          //   identifyTask.execute(params).then(function(response) {
          //     var results = response.results;
          //     console.log(results);
          //   });
          // }
          // );
        });
      }
    );
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// @import url("https://js.arcgis.com/4.10/esri/themes/light/main.css");
header {
  background: gray;
  height: 55px;
  padding: 0;
}

.minMap {
  width: 80%;
}

#viewDiv {
  height: 100%;
  width: 100%;
}

#map-btn-grp {
  position: absolute;
  right: 15px;
  margin-top: 15px;
}

.btn-primary {
  border-radius: 30px;
  // margin: 0px 5px;
  background-color: #3a3a3a;
  border-color: #c9e8ff;
  color: #c9e8ec;
  width: 50px;
  transition: all 0.2s ease-in-out;
  max-height: 40px;
}

.btn-primary:hover {
  width: 135px;
  background-color: #089fc1;
  border-color: #089fc1;
}

#basemap-btn:hover::after {
  content: " Basemaps";
}

#mapLayers-btn:hover::after {
  content: " Maplayers";
}
</style>
