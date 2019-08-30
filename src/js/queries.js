import config from "../store/config.json";
import { mapGetters } from "vuex";
import { store } from "../store/store";

export function getSchoolDistricts(Query,QueryTask) {
    let _this = this;
    var citiesLayerUrl = config.SchoolDistrictUrl; // Represents the REST endpoint for a layer of cities.
    var queryTask = new QueryTask({
      url: citiesLayerUrl
    });
    var query = new Query();
    query.returnGeometry = false;
    query.outFields = ["UNI_MAJ","UNI_NAM"];
    query.where = "1=1";  // Return all cities with a population greater than 1 million
  
    // When resolved, returns features and graphics that satisfy the query.
    queryTask.execute(query).then(function(results){
      console.log(results.features);
      //store.commit("setSchoolDistricts", results.features);
      config.Districts = results.features;
    });
}
