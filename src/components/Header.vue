<template>
  <header>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark" style="z-index: 99;">
      <a class="navbar-brand" v-bind:class="{ navbarLeft: hide }" href="#">TC Parcel</a>

      <div v-if="windowWidth >= 700" id="navbarNav" class="mx-auto">
        <div class="form-inline mx-auto">
          <Search></Search>
        </div>
        <ul class="navbar-nav my-md-0">
          <li class="nav-item">
            <button id="info-btn" type="button" class="btn btn-primary">
              <img id="info-img" src="../assets/info.png" />
            </button>
          </li>
        </ul>
      </div>

      <div v-else id="navbarNav" class="ml-1">
        <div class="form-inline mobile-form-inline">
          <Search v-bind:openMobile="openMobile"></Search>
        </div>
        <ul class="navbar-nav my-md-0">
          <li class="nav-item">
            <button id="info-btn" type="button" class="btn btn-primary" v-bind:class="{ btnHide: hide }">
              <img id="info-img" src="../assets/info.png" />
            </button>
          </li>

          <li v-if="windowWidth <= 550" class="nav-item">
            <button id="mobile-search-btn" type="button" class="btn btn-primary" v-bind:class="{ btnHide: hide }" @click="openMobileSearch">
              <span class="esri-icon-search search-icon"></span>
            </button>
          </li>

          <li v-if="windowWidth <= 550" class="nav-item">
            <button id="close-mobile-search-btn" type="button" class="btn btn-primary" v-bind:class="{ showMobileClose: hide }" @click="hideMobileSearch">
              <span class="esri-icon-close close-icon"></span>
            </button>
          </li>
      
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import Search from "./Search.vue";

export default {
  name: "Header",
  components: {
    Search
  },

  data() {
    return {
      windowWidth: null,
      openMobile: [],
      hide: false
    };
  },

  mounted() {
    console.log("Header mounted");
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  },

  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
      // if (this.windowWidth > 550){
      //   this.hideMobileSearch();
      // } else {
      //   this.openMobileSearch();
      // }
      console.log("this.windowWidth", this.windowWidth);
    },

    openMobileSearch() {
      this.openMobile = true;
      this.hide = true;
    },

    hideMobileSearch() {
      this.hide = false;
       this.openMobile = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
header {
  background: gray;
  height: 55px;
  padding: 0;
}

.navbarLeft {
  left: -9999px;
}

#close-mobile-search-btn {
  display: none;
    width: 40px;
  max-height: 40px;
  border-radius: 30px;
  margin: 0px 5px;
  background-color: #089fc1;
  position: absolute;
  top: 8px;
  right: 15px;
  height: 40px;
  transition: all 0.2s ease-in-out;
  content: "";
}

.mobile-form-inline {
     position: absolute;
    left: 3%;
    top: 11px;
    width: 84%;
}

.showMobileClose {
  display: block!important;
}

.search-icon {
  color: white;
  position: absolute;
  top: 13px;
  left: 14px;
  font-weight: 600;
}

.close-icon {
  color: white;
    position: absolute;
    top: 13px;
    left: 12px;
    font-weight: 600;
}
// .btn-primary {
//   width: 45px;
//   border-radius: 30px;
//   margin: 0px 5px;
//   background-color: #089fc1;

//   max-height: 40px;
// }

// .btn-primary:hover {
//   width: 135px;
//   background-color: #089fc1;
//   border-color: #089fc1;
// }

#info-btn {
  width: 40px;
  max-height: 40px;
  border-radius: 30px;
  margin: 0px 5px;
  background-color: #089fc1;
  position: absolute;
  top: 8px;
  right: 15px;
  height: 40px;
  transition: all 0.2s ease-in-out;
  content: "";
}

#info-btn:hover {
  width: 135px;
  background-color: #089fc1;
  border-color: #089fc1;
  content: "";
}

#info-btn:hover::after {
  content: " Information";
  position: absolute;
  top: 6px;
  left: 38px;
}

#info-img {
  left: 0.65em;
  position: absolute;
  top: 8px;
}

.btnHide {
  display: none;
}

#mobile-search-img {
  left: 9px;
  position: absolute;
  top: 8px;
}

#info-img:hover {
  float: left;
}

// #search-input {
//   width: 300px !important;
// }

#mobile-search-btn {
  width: 41px;
  max-height: 40px;
  border-radius: 30px;
  margin: 0px 5px;
  background-color: #00d049;
  position: absolute;
  top: 8px;
  right: 65px;
  height: 40px;
}

@media screen and (max-width: 767px) and (min-width: 574px) {
  // #info-btn {
  //   top: 50px;
  // }
}

@media screen and (max-width: 573px) {
  // #info-btn {
  //   top: 93px;
  // }
}
</style>
