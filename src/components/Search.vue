<template>
  <div style="width: 100%;">
    
    <div v-if="windowWidth > 550 && !openMobileSearch" class="input-group">
      <input
        id="search-input-box"
        class="form-control search-input"
        v-model.trim="search"
        v-bind:placeholder="configs.placeholder"
        @input="autosuggest($event)"
        @keyup.down="onArrowDown"
        @keyup.up="onArrowUp"
        @keyup.enter="onEnter"
        :class="{ 'isInvalid': invalidInput }"
        varia-label="Find an Address or PIN"
      />
      <div class="input-group-append">
        <span class="input-group-text esri-icon-search" id="search-btn" v-on:click="searchInput(null)"></span>
      </div>
    </div>

    <div v-if="openMobileSearch" class="input-group mobile-search">
      <input
        id="search-input-box"
        class="form-control mobile-search-input"
        v-model.trim="search"
        v-bind:placeholder="configs.placeholder"
        @input="autosuggest($event)"
        @keyup.down="onArrowDown"
        @keyup.up="onArrowUp"
        @keyup.enter="onEnter"
        :class="{ 'isInvalid': invalidInput }"
        varia-label="Find an Address or PIN"
      />
      <div class="input-group-append">
        <span class="input-group-text esri-icon-search" id="search-btn" v-on:click="searchInput(null)"></span>
      </div>
    
  </div>



    <div
      v-if="invalidInput || multipleAddressesFound"
      v-bind:class="{'invalid-tooltip': invalidInput, 'valid-tooltip': multipleAddressesFound}"
    >
      <div v-if="invalidInput">{{errorMessage}}</div>
      <div v-else>
        <button
          id="close-mult-address-btn"
          class="btn close-btn"
          @click="multipleAddressesFound = !multipleAddressesFound"
        >&#10799;</button>
        <p id="mult-addr-msg">Multiple addresses were found. Please select an address below.</p>
        <div class="list-group">
          <a
            v-for="(result, i) in multipleAddresses"
            :key="i"
            href="#"
            class="list-group-item list-group-item-action multiple-address-list-item"
            @click="findMultAddress($event)"
          >{{result.address}}</a>
        </div>
      </div>
    </div>
    <!-- <div class="btn-group" role="group" aria-label="Search">
      <button
        class="btn btn-secondary secondaryColor my-2 my-sm-0 mr-2"
        title="search"
        v-on:click="searchInput(null)"
      >Search</button>
      <button
        class="btn btn-secondary primaryLightColor my-2 my-sm-0"
        data-toggle="modal"
        title="Multi-input search"
        :class="{ 'isMultiInput': multiInput }"
        data-target="#advancedSearchModal"
      >Multi-input</button>
    </div>-->
    <ul
      id="autocomplete-results"
      v-if="configs.useAutoSuggest"
      v-show="isOpen"
      class="autocomplete-results"
      v-bind:style="{ height:  autoHeight + 'px' }"
    >
      <li class="loading" v-if="isLoading">Loading results...</li>
      <li
        ref="autosuggestItem"
        v-else
        v-for="(result, i) in results"
        :key="i"
        @click="setResult(result)"
        class="autocomplete-result"
        :class="{ 'is-active': i === arrowCounter }"
      >{{ result }}</li>
    </ul>
  </div>
</template>

<script>
import { loadModules } from "esri-loader";
import getAddress from "../js/findAddress";
import validateInput from "../js/validateInput";
// import { store } from "../store";
import { mapGetters, mapMutations } from "vuex";
// import map from "../js/map";
// import appStore from "../store/appStore";
import cityJson from "../store/cityReplace.json";
import query from "../js/queries";

import config from "../store/config.json";

const searchOptions = {
  locatorUrl: config.LocatorUrl,
  queryUrl: config.AutoCompleteUrl
};

export default {
  name: "Search",
  props: ['openMobile'],

  data() {
    return {
      configs: {
        useAutoSuggest: true,
        helperText: "Find address or PID",
        placeholder: "Find an Address or PIN"
      },
      autoHeight: 0,
      autoListItemHeight: 32,
      isOpen: false,
      results: [],
      //  search: "2602924220080", // normal pid
      // search: "2302924330055", // child pid
      search: "", // address
      isLoading: false,
      arrowCounter: 0,
      locator: "",
      continueSearch: true,
      invalidInput: false,
      errorMessage: "",
      multipleAddressesFound: false,
      multipleAddresses: [],
      multiInput: false,
      searchType: null,
      invalidPids: [],
      autoCompleteAddresses: [],
      autoCompleteAddressesFull: [],
      windowWidth: null,
      openMobileSearch: false
    };
  },

  computed: {
    esriLocator() {
      return new this.esriModules.Locator(searchOptions.locatorUrl);
    },
    ...mapGetters({
      //   updatedMultiInput: "getMultiInputState",
      //   updateSearchType: "getSearchType"
    })
  },
  methods: {

        handleResize() {
      this.windowWidth = window.innerWidth;
      console.log("this.windowWidth", this.windowWidth);
    },
    /* start the process to search for an input - either address or pid
      @param - address : string | the input
      @return - none
    */
    searchInput(address) {
      console.log("Search.searchInput");
      let input;
      let cityName;
      let continueThisSearch = true;
      //   this.$store.commit("showError", null);
      //   this.$store.commit("showLoaderText", "Searching");
      //   this.$store.commit("showLoader");
      //   this.$store.commit("clearAll", "clear");

      this.continueSearch = false;
      if (address) {
        input = address.trim();
      } else {
        input = this.search;
      }

      if (continueThisSearch) {
        input = validateInput(input);

        if (input.type === "Address" || input.type === "PID") {
          // this.$store.commit("changeSearchType", "address");
          if (input.type === "Address") {
            cityName = this.getCity(input.value.split(",")[1]);
            if (cityName) {
              input.value = `${input.value.split(",")[0]},${cityName}`;
            }

            let autoComplAddrFound = this.checkIfAutoComplAddress(
              input.value,
              this.autoCompleteAddresses,
              "check"
            );

            if (autoComplAddrFound) {
              let objectId = this.getAutoComplAddress(input.value);
              query.queryByObjectId(
                objectId,
                this.esriModules.Query,
                this.esriModules.QueryTask
              );
            } else {
              this.sendToLocator(input.value);
            }
          } else if (input.type === "PID") {
            query.queryByPid(
              input.value,
              this.esriModules.Query,
              this.esriModules.QueryTask
            );
          }
        } else if (input.type === "Section") {
          // query for section
          query.queryBySection(input.value);
        } else {
          // error
          this.$store.commit("hideLoader");
          this.invalidInput = true;
          this.errorMessage = input.value;
        }
      }
    },

    checkIfAutoComplAddress(address, addressArr, type) {
      let retVal = false;
      let inputAddressAlt = address.replace(/\s/g, "");
      inputAddressAlt = inputAddressAlt.replace(/,/g, "");
      inputAddressAlt = inputAddressAlt.toLowerCase();
      if (addressArr.length > 0) {
        addressArr.forEach(function(item) {
          let addr;
          if (type === "objectid") {
            addr = item.address;
          } else {
            addr = item;
          }
          let addrAlt = addr.replace(/\s/g, "");
          addrAlt = addrAlt.replace(/,/g, "");
          addrAlt = addrAlt.toLowerCase();
          if (inputAddressAlt === addrAlt) {
            if (type === "check") {
              retVal = true;
            } else if (type === "objectid") {
              retVal = item.objectId;
            }
          }
        });
      }

      return retVal;
    },

    getAutoComplAddress(address) {
      console.log("use the autocompl address", address);
      let objectId = this.checkIfAutoComplAddress(
        address,
        this.autoCompleteAddressesFull,
        "objectid"
      );
      console.log("objectid", objectId);
      return objectId;
    },

    /* multiple pids were entered in the search input
      @param - input : string | the search input
      @return - none
    */
    queryForManyPids(input) {
      console.log("queryForManyPids");
      const _this = this;
      //   this.$store.commit("changeSearchType", "address");
      const inputArr = input.split(",");

      if (inputArr.length > 0) {
        const inputLength = inputArr.length;

        inputArr.forEach(item => {
          const inputCheck = validateInput(item);
          if (inputCheck.type === "PID") {
            query.queryByPid(inputCheck.value, _this.multiInput, inputLength);
          } else {
            _this.invalidPids.push(item);
            query.addToInvalidPids();
          }
        });

        if (this.invalidPids.length > 0) {
          let msg = "These values were not found:";
          this.invalidPids.forEach(i => {
            msg += `<br/>${i}`;
          });

          this.$store.commit("showError", msg);
          this.$store.commit("hideLoader");
        }
      }
    },

    /* handle when multiple addresses were found and one of them was clicked
      @param - evt : object | the click event object
      @return - none
    */
    findMultAddress(evt) {
      const address = evt.target.innerText;
      // this.$store.commit("changeSearchType", "address");
      this.searchInput(address);
      this.multipleAddressesFound = false;
    },

    /* send the address input to the locator
      @param - input : string | the search input
      @return - none
    */
    sendToLocator(input) {
      console.log("Search.sendToLocator", input);

      const searchAddress = { SingleLine: input };
      const options = {
        address: searchAddress,
        outFields: ["Loc_name"]
      };

      const self = this;
      this.locator.addressToLocations(options).then(
        cand => {
          console.log(cand);
          const foundAddress = getAddress(cand);
          if (foundAddress.length === 1) {
            // self.$store.commit("clearAll", false);

            query.queryByPoint(
              foundAddress[0].location,
              this.esriModules.Query,
              this.esriModules.QueryTask
            );
          } else if (foundAddress.length > 1) {
            self.$store.commit("hideLoader");
            self.multipleAddressesFound = true;
            self.multipleAddresses = foundAddress;
          } else {
            self.$store.commit("hideLoader");
            self.invalidInput = true;
            self.errorMessage = "Not found";
          }
        },
        err => {
          self.$store.commit("hideLoader");
          self.invalidInput = true;
          self.errorMessage = "Error";
        }
      );
    },

    /* processes an entry in the search input for address autocomplete
      @param - event : object | the search input enter event
      @return - none
    */
    autosuggest(event) {
      console.log("Search.autosuggest", this.search, event);

      if (this.multipleAddressesFound) {
        this.multipleAddressesFound = false;
      }

      this.invalidInput = false;
      this.continueSearch = true;

      if (event.inputType === "deleteContentBackward") {
        this.isOpen = false;
        this.results.length = 0;
        this.arrowCounter = 0;
      } else if (this.search.length <= 4) {
        this.isOpen = false;
        this.results.length = 0;
        this.arrowCounter = 0;
      } else if (this.search.length > 4) {
        this.isOpen = true;
        this.results.length = 0;
        this.arrowCounter = 0;
        const qTask = new this.esriModules.QueryTask({
          url: searchOptions.queryUrl
        });

        const params = new this.esriModules.Query({
          returnGeometry: false,
          outFields: [
            "ANUMBER",
            "CTU_NAME",
            "ST_NAME",
            "ST_POS_TYP",
            "ST_POS_DIR",
            "ZIP",
            "OBJECTID"
          ]
        });

        //  params.where = `SUBSTRING(CONCAT_AD FROM 1 FOR ${this.search.length}) LIKE '%${this.search}%'`;

        let houseNumber, streetName, pos;
        if (this.search.split(" ").length === 2) {
          this.continueSearch = true;
          houseNumber = this.search.split(" ")[0];
          streetName = this.search.split(" ")[1];
          params.where = `ANUMBER = '${houseNumber}' AND SUBSTRING(ST_NAME FROM 1 FOR ${streetName.length})  LIKE '%${streetName}%'`;
        } else if (this.search.split(" ").length > 2) {
          this.continueSearch = true;
          houseNumber = this.search.split(" ")[0];
          streetName = this.search.split(" ")[1];
          pos = this.search.split(" ")[2];
          params.where = `ANUMBER = '${houseNumber}' AND SUBSTRING(ST_NAME FROM 1 FOR ${streetName.length})  LIKE '%${streetName}%' AND ( SUBSTRING(ST_POS_TYP FROM 1 FOR ${pos.length})  LIKE '%${pos}%' OR  SUBSTRING(ST_POS_DIR FROM 1 FOR ${pos.length})  LIKE '%${pos}%')`;
        } else {
          this.isOpen = false;
          this.continueSearch = false;
        }

        //   params.where = `ANUMBER = '${houseNumber}' AND SUBSTRING(ST_NAME FROM 1 FOR ${streetName.length})  LIKE '%${streetName}%' OR `;
        //ANUMBER = '4029' AND ST_NAME LIKE '%44%'
        if (this.continueSearch) {
          qTask
            .execute(params)
            .then(this.getResults)
            .catch(this.promiseRejected);
        }
      }
    },

    /* results found from address autocomplete search
      @param - response : object | the search input results 
      @return - none
    */
    getResults(response) {
      console.log("Search.getResults", response);
      //const addArr = [];
      this.autoCompleteAddresses = [];
      this.autoCompleteAddressesFull = [];
      if (this.continueSearch) {
        if (response.features.length > 0) {
          response.features.forEach(item => {
            //const addPredictResult = `${item.attributes.CONCAT_AD.trim()}, ${item.attributes.MUNI_NAME.trim()}`;
            //   const addPredictResult = `${
            //     item.attributes.ANUMBER
            //   }, ${item.attributes.CTU_NAME.trim()}`;

            const addPredictResult = this.constructStreetAddress(
              item.attributes
            );

            //   if (item.attributes.SUB_AD_ID.length > 0) {
            //     const add = addPredictResult; // "3000 RALEIGH AVENUE SOUTH 401, ST. LOUIS PARK"
            //     const spl = add.split(",")[0]; // "3000 RALEIGH AVENUE SOUTH 401"
            //     const spl1 = spl.trim(); // "3000 RALEIGH AVENUE SOUTH 401"
            //     const spl2 = spl1.lastIndexOf(item.attributes.SUB_ID1); // 26
            //     let spl3 = spl1.slice(0, spl2); // "3000 RALEIGH AVENUE SOUTH"

            //     if (spl3.indexOf("#") > -1) {
            //       // removes '#' if it is in the address
            //       const hashIndex = spl3.indexOf("#");
            //       const subHash = spl3.substr(0, hashIndex);
            //       spl3 = subHash;
            //     }

            //     const add2 = `${spl3.trim()}, ${item.attributes.MUNI_NAME.trim()}`; // "3000 RALEIGH AVENUE SOUTH, ST. LOUIS PARK"
            //     addArr.push(add2);
            //   } else {
            //     const add2 = addPredictResult;
            //     addArr.push(add2);
            //   }

            // const add2 = addPredictResult;
            this.autoCompleteAddresses.push(addPredictResult);
            this.autoCompleteAddressesFull.push({
              address: addPredictResult,
              objectId: item.attributes.OBJECTID
            });
            //addArr.push(add2);
          });

          let left = this.autoCompleteAddresses;

          left = [...new Set(left)];
          this.results = left;

          console.log("fitler results", this.results);
          this.isOpen = true;
          this.adjustAutoHeight();
        } else {
          this.isOpen = false;
        }
      }
    },

    constructStreetAddress(attr) {
      const houseNumber = this.getCleanValue(attr.ANUMBER);
      const city = this.getCleanValue(attr.CTU_NAME);
      const street = this.getCleanValue(attr.ST_NAME);
      const stPostType = this.getCleanValue(attr.ST_POS_TYP);
      const stPosDir = this.getCleanValue(attr.ST_POS_DIR);

      let address =
        houseNumber + " " + street + stPostType + stPosDir + ", " + city;

      address = address.replace(/^[,\s]+|[,\s]+$/g, "");
      address = address.replace(/\s*,\s*/g, ", ");

      return address;
    },

    getCleanValue(val) {
      let newVal;
      if (val) {
        if (val !== null) {
          if (val !== "Null") {
            if (val != "0") {
              if (typeof val === "string") {
                newVal = val.trim() + " ";
              } else {
                newVal = val.toString().trim() + "";
              }
              // newVal = val + " ";
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

    /* error found from address autocomplete search
      @param - error : object | the error
      @return - none
    */
    promiseRejected(error) {
      console.error("Promise rejected: ", error.message);
      this.$store.commit("showError", "There was an issue retrieving data.");
      this.$store.commit("hideLoader");
    },

    /* an address in the autocomplete results is selected
      @param - result : string | the address selected
      @return - none
    */
    setResult(result) {
      console.log("Search.setResult", result);
      this.continueSearch = false;
      this.search = result;
      this.isOpen = false;
    },

    /* handles keydown event in search input
      @param - none
      @return - none
    */
    onArrowDown() {
      if (this.arrowCounter < this.results.length) {
        this.arrowCounter = this.arrowCounter + 1;
      }
    },

    /* handles keyup event in search input
      @param - none
      @return - none
    */
    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1;
      }
    },

    /* handles enter key event in search input
      @param - none
      @return - none
    */
    onEnter() {
      this.search = this.results[this.arrowCounter] || this.search;
      this.isOpen = false;
      this.arrowCounter = -1;
      this.continueSearch = false;
      this.searchInput(null);
    },

    /* adjusts the size of the autocomplete results
      @param - none
      @return - none
    */
    adjustAutoHeight() {
      this.autoHeight = this.results.length * this.autoListItemHeight;
    },

    /* using cityJson, find a correct spelling of the city
      @param - city : string | the city
      @return - string | the correct city name
    */
    getCity(city) {
      console.log("city", cityJson);
      let cityName = "";
      cityJson.CITIES.MUNIC.forEach(c => {
        c.OPTION.find(e => {
          if (e === city.toUpperCase().trim()) {
            cityName = c.CITYNAME;
          }
        });
      });
      return cityName;
    },

    /* changes status of multi input
      @param - none
      @return - none
    */
    changeMultiInput() {
      this.multiInput = !this.multiInput;
      this.$store.commit("changeMultiInputState", this.multiInput);
    }
  },

  watch: {
    /* watches for a change in multi input states
      @param - multiInput : string | multi input status
      @return - none
    */
    updatedMultiInput(multiInput) {
      if (multiInput) {
        this.multiInput = true;
      } else {
        this.multiInput = false;
      }
    },

    openMobile(open) {
      if (open){
        this.openMobileSearch = true;
      } else {
         this.openMobileSearch = false;
      }
      console.log("open mobile search", open);
    },

    /* watches for a change search type
      @param - searchType : string | the search type
      @return - none
    */
    updateSearchType(searchType) {
      this.searchType = searchType;
    }
  },

  mounted() {
    console.log("map: mounted");
    loadModules([
      "esri/tasks/Locator",
      "esri/tasks/QueryTask",
      "esri/tasks/support/Query"
    ]).then(([Locator, QueryTask, Query]) => {
      this.esriModules = {
        Locator,
        QueryTask,
        Query
      };

      this.locator = this.esriLocator;
    });

    /**** fixes IE issue with selecting multi input from caches status of switch button ******/
    // let search = document.getElementsByClassName("search-input")[0];
    //search.value = "";

    // this.$store.commit("changeMultiInputState", false);
    // let multiCheckbox = document.getElementById("multi-input-checkbox");
    // multiCheckbox.checked = false;
    // document.getElementById("multi-form").reset();
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  }
};
</script>

<style scoped>
#searchHelp {
  margin-top: -5px;
  margin-bottom: 1px;
  font-size: 14px;
  /* justify-content: left!important; */
}

#search-btn {
  color: white;
}

.search-input {
  width: 400px !important;
  border-bottom: 2px solid #089fc1;
  font-size: 18px;
    padding-bottom: 1px
}

.custom-file-control, .form-control, .is-focused .custom-file-control, .is-focused .form-control {
    background-image: linear-gradient(0deg,#089fc1 2px,rgba(0,150,136,0) 0),linear-gradient(0deg,rgba(0,0,0,.26) 2px,transparent 0);
}

.text-muted {
  color: #cacbcc !important;
}

.autocomplete-results {
  padding: 0;
  margin: 0;
  height: 250px;
  overflow: auto;
  width: 400px;
  position: absolute;
  z-index: 99;
  background: white;
  color: black;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
}

.autocomplete-result.is-active,
.autocomplete-result:hover {
  background-color: #4aae9b;
  color: white;
}

.modal-content {
  border-radius: 2px;
}

.modal-title {
  color: black;
}

.invalid-tooltip {
  display: block;
  z-index: 99;
  top: auto;
  max-width: 400px !important;
}

.valid-tooltip {
  display: block;
  z-index: 99;
  top: auto;
}

.isInvalid {
  border: 1px solid red;
}

.isMultiInput {
  background: #b2ffb2 !important;
}

.multiple-address-list-item {
  padding: 10px;
}

#mult-addr-msg {
  padding: 8px;
}

#close-mult-address-btn {
  z-index: 99;
  position: absolute;
  top: -14px;
  right: -8px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 65px;
  height: 30px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 28px;
  width: 28px;
  left: 2px;
  bottom: 1px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  z-index: 9;
}

input:checked + .slider {
  background-color: #05f705 !important;
}

input:focus + .slider {
  box-shadow: 0 0 1px #05f705 !important;
}

input:checked + .slider:before {
  -webkit-transform: translateX(33px);
  -ms-transform: translateX(33px);
  transform: translateX(33px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 22px;
}

.slider.round:before {
  border-radius: 50%;
}

.multi-input-text {
  font-size: 15px;
  color: black;
}

.multi-on {
  left: 6px;
  position: absolute;
  font-size: 13px;
  top: 4px;
  color: black;
}

.multi-off {
  position: absolute;
  right: 10px;
  color: black;
  font-size: 13px;
  top: 4px;
}

.input-group-append {
      padding: 0 8px;
}

.input-group-append:hover {
      /* background: #089fc1; */
      cursor: pointer;
}

@media screen and (max-width: 700px) {
  .search-input {
    width: 380px !important;
  }
}

@media screen and (max-width: 650px) {
  .search-input {
    width: 330px !important;
  }
}

@media screen and (max-width: 600px) {
  .search-input {
    width: 280px !important;
  }
}
</style>
