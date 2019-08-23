<template>
  <div 
    v-bind:class="{ resultsOpen: showLeftPane }"
     v-bind:style="{width: resultsWidth}">
    <table class="table">
      <tbody>
        <tr></tr>
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
      resultsWidth: 0,
      nresult: null,
      showLeftPane: false,
      addressResult: {
        owner: null,
        pid: null
      }
    };
  },
  mounted() {
     window.addEventListener("resize", this.adjustLeftPaneWidth);
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
      if (res.length === 1) {
        this.processAttributes(res[0].feature.attributes);
        this.adjustLeftPaneWidth("results");
      }
    },

    adjustLeftPaneWidth(type) {
      let windowWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;

      if (type !== "clear") {
        if (windowWidth > 1400) {
          this.resultsWidth = "30%";
        } else if (windowWidth > 900 && windowWidth <= 1400) {
          this.resultsWidth = "40%";
        } else if (windowWidth > 700 && windowWidth <= 900) {
          this.resultsWidth = "50%";
        } else if (windowWidth <= 700) {
          this.resultsWidth = "100%";
        }
      } else {
        this.resultsWidth = "0";
      }
    },

    processAttributes(attr) {
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
.resultsOpen {
  width: 30%;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  background: white;
  margin-top: 56px;
}
</style>
