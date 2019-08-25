<template>
  <div v-bind:class="{ resultsOpen: showLeftPane }" v-bind:style="{width: resultsWidth}">
    <table class="table table-sm">
      <tbody>
        <tr></tr>
        <tr>
          <th scope="row">PIN</th>
          <td>{{addressResult.pin}}</td>
        </tr>
        <tr v-if="addressResult.owner">
          <th scope="row">Owner</th>
          <td>{{addressResult.owner}}</td>
        </tr>
        <tr v-if="addressResult.taxpayer">
          <th scope="row">Taxpayer</th>
          <td>{{addressResult.taxpayer}}</td>
        </tr>
        <tr>
          <th scope="row">Address</th>
          <td>{{addressResult.fullAddress}}</td>
        </tr>
        <tr>
          <th scope="row">County</th>
          <td>{{addressResult.county}}</td>
        </tr>
        <tr v-if="addressResult.school">
          <th scope="row">School District</th>
          <td>{{addressResult.school}}</td>
        </tr>
        <tr>
          <th scope="row">Acres</th>
          <td>{{addressResult.acres}}</td>
        </tr>
        <tr v-if="addressResult.buildYear">
          <th scope="row">Year built</th>
          <td>{{addressResult.buildYear}}</td>
        </tr>
        <tr v-if="addressResult.tmv">
          <th scope="row" colspan="2">Market Value</th>
        </tr>
        <tr v-if="addressResult.tmv">
          <th scope="row" class="indent-left">Total</th>
          <td>{{addressResult.tmv}}</td>
        </tr>
        <tr v-if="addressResult.lmv">
          <th scope="row" class="indent-left">Land</th>
          <td>{{addressResult.lmv}}</td>
        </tr>
        <tr v-if="addressResult.bmv">
          <th scope="row" class="indent-left">Building</th>
          <td>{{addressResult.bmv}}</td>
        </tr>
        <tr v-if="addressResult.saleDate">
          <th scope="row">Sale Date</th>
          <td>{{addressResult.saleDate}}</td>
        </tr>
        <tr v-if="addressResult.salePrice">
          <th scope="row">Sale Price</th>
          <td>{{addressResult.salePrice}}</td>
        </tr>
        <tr v-if="addressResult.homestead">
          <th scope="row">Homestead</th>
          <td>{{addressResult.homestead}}</td>
        </tr>
                <tr v-if="addressResult.propType">
          <th scope="row">Property type</th>
          <td>{{addressResult.propType}}</td>
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
        taxpayer: null,
        pid: null,
        fullAddress: null,
        county: null,
        school: null,
        acres: null,
        buildYear: null,
        tmv: null,
        bmv: null,
        lmv: null,
        homestead: null,
        propType: null
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
      this.addressResult.owner = this.getCleanValue(attr.OWNER_NAME);
      this.addressResult.taxpayer = this.getCleanValue(attr.TAX_NAME);
      this.addressResult.pin = this.getCleanValue(attr.COUNTY_PIN);
      this.addressResult.school = this.getCleanValue(attr.SCHOOL_DST);
      this.addressResult.fullAddress = this.constructStreetAddress(attr);
      this.addressResult.county = this.getCleanValue(attr.CO_NAME);
      this.addressResult.acres = this.getCleanValue(attr.ACRES_POLY);
      this.addressResult.buildYear = this.getCleanValue(attr.YEAR_BUILT);
      this.addressResult.tmv = this.convertToUsDollars(
        this.getCleanValue(attr.EMV_TOTAL)
      );
      this.addressResult.lmv = this.convertToUsDollars(
        this.getCleanValue(attr.EMV_LAND)
      );
      this.addressResult.bmv = this.convertToUsDollars(
        this.getCleanValue(attr.EMV_BLDG)
      );
      this.addressResult.salePrice = this.convertToUsDollars(
        this.getCleanValue(attr.SALE_VALUE)
      );
      this.addressResult.saleDate = this.getCleanValue(attr.SALE_DATE);
      this.addressResult.homestead = this.getCleanValue(attr.HOMESTEAD);
       this.addressResult.propType = this.getCleanValue(attr.USECLASS1);
    },

    constructStreetAddress(attr) {
      const houseNumber = this.getCleanValue(attr.ANUMBER);
      const city = this.getCleanValue(attr.CTU_NAME);
      const street = this.getCleanValue(attr.ST_NAME);
      const stPostType = this.getCleanValue(attr.ST_POS_TYP);
      const stPosDir = this.getCleanValue(attr.ST_POS_DIR);

      const zip = this.getCleanValue(attr.ZIP);
      let address =
        houseNumber + " " + street + stPostType + stPosDir + ", " + city + zip;

      address = address.replace(/^[,\s]+|[,\s]+$/g, "");
      address = address.replace(/\s*,\s*/g, ", ");

      return address;
    },

    getCleanValue(val) {
      let newVal;
      if (val) {
        if (val !== null) {
          if (val !== "Null") {
            if (val.trim() != "0") {
              newVal = val.trim() + " ";
            } else {
              newVal = "";
            }
          } else {
            newVal = "";
          }
        } else {
          newVal = "";
        }
      } else {
        newVal = "";
      }

      return newVal;
    },

    convertToUsDollars(val) {
      if (val) {
        if (val.trim() != "0") {
          const formatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0
          });

          return formatter.format(val); // "$1,000.00"
        } else {
          return "";
        }
      } else {
        return "";
      }
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

.indent-left {
  padding-left: 20px !important;
  font-style: italic;
}
</style>
