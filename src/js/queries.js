import config from "../store/config.json";
import { mapGetters } from "vuex";
import store from "../store/store";
export default {
  getSchoolDistricts(Query, QueryTask) {
    let _this = this;
    var citiesLayerUrl = config.SchoolDistrictUrl; // Represents the REST endpoint for a layer of cities.
    var queryTask = new QueryTask({
      url: citiesLayerUrl
    });
    var query = new Query();
    query.returnGeometry = false;
    query.outFields = ["UNI_MAJ", "UNI_NAM"];
    query.where = "1=1"; // Return all cities with a population greater than 1 million

    // When resolved, returns features and graphics that satisfy the query.
    queryTask.execute(query).then(function(results) {
      console.log(results.features);
      //store.commit("setSchoolDistricts", results.features);
      config.Districts = results.features;
    });
  },

  queryByObjectId(objectId, Query, QueryTask) {
    let _this = this;
    const qTask = new QueryTask({
      url: config.ParcelsPoly
    });

    const params = new Query({
      returnGeometry: true,
      outFields: ["*"],
      where: `OBJECTID = '${objectId}'`
    });

    qTask
      .execute(params)
      .then(results => {
        console.log("queryByObjectid results", results.features);
        if (results.features.length === 0) {
        } else if (results.features.length === 1) {
          //  map.zoomToLocation(res.features[0].geometry);
          //  store.commit("hideLoader");
          store.commit("setNewResult", results.features);
        } else {
          // more than one sections
          // const geomArr = [];
          // res.features.forEach((item) => {
          //   geomArr.push(item.geometry);
          // });
          // const union = esriMods.geometryEngine.union(geomArr);
          // map.zoomToLocation(union);
          // console.log("union", union);
          // store.commit("hideLoader");
        }
      })
      .catch(err => {
        console.log("error querying for data", err);
        // store.commit("showError", "There was an issue retrieving data.");
        // store.commit("hideLoader");
      });
  },

  /* query by a point
    @param - foundPoint : object | a point
    @param - multiInput : boolean | if multi input is on
    @param - type : string | the type to clear - either buffer or all features
    @return - none
  */
  queryByPoint(foundPoint, Query, QueryTask) {
    console.log("store.queryByPoint", foundPoint);
    const _this = this;

    const qTask = new QueryTask({
      url: config.ParcelsPoly
    });

    const params = new Query({
      returnGeometry: true,
      outFields: ["*"],
      geometry: foundPoint,
      spatialRelationship: "intersects"
    });

    qTask
      .execute(params)
      .then(results => {
        console.log("query results", results);
        store.commit("setNewResult", results.features);
        //  _this.processAddressResults(foundPoint, res, multiInput, type);
      })
      .catch(err => {
        console.log("error querying for data", err);
       // store.commit("showError", "There was an issue retrieving data.");
       // store.commit("hideLoader");
      });
  },

  /* query by pid
    @param - pid : string | the pid to query
    @param - multiInput : boolean | if multi input is on
    @param - inputLen : number | the number of pids entered in input, if users do so
    @return - none
  */
 queryByPid (pid, Query, QueryTask) {
  console.log("store.queryByPid", pid);
  // bad one - 2602924220351
  const _this = this;

  const qTask = new QueryTask({
    url: config.ParcelsPoly
  });


  const params = new Query({
    returnGeometry: true,
    outFields: ["*"],
    where: `PIN LIKE '%${pid}%'`
  });

  qTask.execute(params)
    .then((results) => {
      console.log("queryByPid results", results);
      if (results.features.length > 0) {
        store.commit("setNewResult", results.features);
      }
    })
    .catch((err) => {
      console.log("error querying for data", err);
    //  store.commit("showError", "There was an issue retrieving data.");
    //  store.commit("hideLoader");
    });
},
};
