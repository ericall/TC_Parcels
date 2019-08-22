import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    results: []

  },
  getters: {
    getResults: state => state.results
  },
  mutations: {
   setNewResult: (state, result) => {
    state.results = result;
  }
  },
  actions: {

  }
})
