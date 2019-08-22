<template>
  <div v-bind:class="{ resultsOpen: showLeftPane }" >
    <table class="table">

      <tbody>
        <tr>
            <tr>
          <th scope="row">PIN</th>
          <td>{{addressResult.pin}}</td>
        </tr>
        <tr>
          <th scope="row">Owner</th>
          <td>{{addressResult.owner}}</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Jacob</td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td>Larry</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
//import { store } from "../store/store";
//import { mapState } from "vuex";
import { mapGetters } from "vuex";

export default {
  name: "Results",
  data() {
    return {
      nresult: null,
      showLeftPane: false,
     addressResult: {
        owner:null,
        pid: null
      }
    };
  },
  computed: {
    // result() {
    //   return store.state.results;
    // },
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
        this.showLeftPane = true;
      this.nresult = res;
      if (res.length === 1){
        this.processAttributes(res[0].feature.attributes);
      }
    },

    processAttributes(attr){
      this.addressResult.owner = attr.OWNER_NAME;
      this.addressResult.pin = attr.COUNTY_PIN;
      this.addressResult.streetAddress = this.constructStreetAddress(attr);
    },

    constructStreetAddress(attr) {
      const houseNumber = attr.ANUMBER;

    }

  }
};
</script>

<style scoped>
.resultsOpen{
    width: 350px;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    background: white;
}
</style>
