<template>
  <div
    id="results-pane"
    v-bind:class="{ resultsOpen: showLeftPane }"
    v-bind:style="{width: resultsWidth, height: resultsHeight}"
  >
    <table class="table table-sm table-striped">
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
        <tr v-if="addressResult.totalTax">
          <th scope="row">Total Tax</th>
          <td>{{addressResult.totalTax}}</td>
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
        <tr>
          <th scope="row" colspan="2">Building Info</th>
        </tr>
        <tr v-if="addressResult.homeStyle">
          <th scope="row" class="indent-left">Home Style</th>
          <td>{{addressResult.homeStyle}}</td>
        </tr>
        <tr v-if="addressResult.dwellingType">
          <th scope="row" class="indent-left">Dwelling Type</th>
          <td>{{addressResult.dwellingType}}</td>
        </tr>
        <tr v-if="addressResult.numOfUnits">
          <th scope="row" class="indent-left">Number of Units</th>
          <td>{{addressResult.numOfUnits}}</td>
        </tr>
        <tr v-if="addressResult.finishedSqFt">
          <th scope="row" class="indent-left">Finished SqFt</th>
          <td>{{addressResult.finishedSqFt}}</td>
        </tr>
        <tr v-if="addressResult.basement">
          <th scope="row" class="indent-left">Basement</th>
          <td>{{addressResult.basement}}</td>
        </tr>
        <tr v-if="addressResult.heating">
          <th scope="row" class="indent-left">Heating</th>
          <td>{{addressResult.heating}}</td>
        </tr>
        <tr v-if="addressResult.cooling">
          <th scope="row" class="indent-left">Cooling</th>
          <td>{{addressResult.cooling}}</td>
        </tr>
                <tr v-if="addressResult.garage">
          <th scope="row" class="indent-left">Garage</th>
          <td>{{addressResult.garage}}</td>
        </tr>
                <tr v-if="addressResult.garageSqFt">
          <th scope="row" class="indent-left">Garage SqFt</th>
          <td>{{addressResult.garageSqFt}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
//import { store } from "../store/store";
//import { mapState } from "vuex";
import { mapGetters } from "vuex";
import config from "../store/config.json";

export default {
  name: "Results",
  data() {
    return {
      resultsWidth: 0,
      resultsHeight: 0,
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
        propType: null,
        basement: null, //BASEMENT
        finishedSqFt: null, //FIN_SQ_FT
        garage: null, //GARAGE
        garageSqFt: null, //GARAGESQFT
        cooling: null, //COOLING
        heating: null, //HEATING
        numOfUnits: null, //NUM_UNITS,
        homeStyle: null, //HOME_STYLE,
        totalTax: null, //TOTAL_TAX
        dwellingType: null //DWELL_TYPE
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
      result: "getResults",
      schoolDistricts: "getSchoolDistricts"
    })
  },
  watch: {
    result(res) {
      console.log("watch result", res);

      this.processResults(res);
    },
    schoolDistricts(sd) {
      console.log("Schoold districts");
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
      var headerHeight = document.getElementsByTagName("header")[0]
        .clientHeight;
      this.resultsHeight = window.innerHeight - headerHeight + "px";
    },

    processAttributes(attr) {
      this.addressResult.owner = this.getCleanValue(attr.OWNER_NAME);
      this.addressResult.taxpayer = this.getCleanValue(attr.TAX_NAME);
      this.addressResult.pin = this.getCleanValue(attr.COUNTY_PIN);
      this.addressResult.school = this.getDistrict(attr.SCHOOL_DST);
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
      this.addressResult.totalTax = this.convertToUsDollars(
        this.getCleanValue(attr.TOTAL_TAX)
      );
      this.addressResult.saleDate = this.getCleanValue(attr.SALE_DATE);
      this.addressResult.homestead = this.getCleanValue(attr.HOMESTEAD);
      this.addressResult.propType = this.getCleanValue(attr.USECLASS1);
      this.addressResult.finishedSqFt = this.getCleanValue(attr.FIN_SQ_FT);
      this.addressResult.homeStyle = this.getCleanValue(attr.HOME_STYLE);
      this.addressResult.dwellingType = this.getCleanValue(attr.DWELL_TYPE);
      this.addressResult.basement = this.getCleanValue(attr.BASEMENT);
      this.addressResult.heating = this.getCleanValue(attr.HEATING);
      this.addressResult.cooling = this.getCleanValue(attr.COOLING);
      this.addressResult.numOfUnits = this.getCleanValue(attr.NUM_UNITS);
      this.addressResult.garage = this.getCleanValue(attr.GARAGE);
      this.addressResult.garageSqFt = this.getCleanValue(attr.GARAGESQFT);
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
    },

    getDistrict(dist) {
      let schoolDistrict;
      let schDist = dist.split("-")[1];
      if (config.Districts.length > 0) {
        config.Districts.forEach(function(d) {
          if (parseInt(schDist) == d.attributes.UNI_MAJ) {
            schoolDistrict = d.attributes.UNI_NAM;
          }
        });
        return schoolDistrict;
      }
    }
  }
};
</script>

<style scoped>
#results-pane {
  overflow: auto;
  background: rgb(58, 58, 58);
  color: rgb(228, 231, 234);
}

.resultsOpen {
  width: 30%;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  background: white;
  margin-top: 55px;
}

.indent-left {
  padding-left: 25px !important;
  font-style: italic;
  font-size: 15px;
}

.table-sm td,
.table-sm th {
  padding-left: 10px;
}

.table td,
.table th {
  border-top: 1px solid #6f6e6e !important;
}

th {
  text-align: inherit;
  font-weight: 500;
  font-style: italic;
  color: #fff4b8;
}

td {
  font-weight: 600;
}
</style>
