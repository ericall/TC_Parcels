import Vue from "vue";
import Vuex from "vuex";
import { getSchoolDistricts } from "../js/queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    results: [],
    schoolDistricts: []
  },
  getters: {
    getResults: state => state.results,
    getSchoolDistricts: state => state.schoolDistricts
  },
  mutations: {
    setNewResult: (state, result) => {
      state.results = result;
    },
    setSchoolDistricts: (state, schoolDistricts) => {
      state.schoolDistricts = schoolDistricts;
    }
  },
  actions: {}
});
