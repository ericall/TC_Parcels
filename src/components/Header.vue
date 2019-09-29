<template>
  <header>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark" style="z-index: 99;">
      <a class="navbar-brand" href="#">TC Parcel</a>
      <!-- <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button> -->
      <div id="navbarNav" class="mx-auto">
        <div class="form-inline mx-auto">
          <!-- <input
            id="search-input"
            class="form-control mr-sm-2"
            type="search"
            placeholder="Search by address or PIN"
          />-->
          <Search></Search>
          <!-- <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button> -->
        </div>
        <ul class="navbar-nav my-md-0">
          <!-- <li class="nav-item active">
      <button type="button" class="btn btn-primary esri-icon-basemap"></button>
      </li>
      <li class="nav-item">
        <button type="button" class="btn btn-primary esri-icon-layers"></button>
          </li>-->

         <li v-if="windowWidth < 768" class="nav-item">
            <button id="search-btn" type="button" class="btn btn-primary  esri-icon-search">
            </button>
          </li>

          <li class="nav-item">
            <button id="info-btn" type="button" class="btn btn-primary">
              <img id="info-img" src="../assets/info.png" />
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
      windowWidth: null
    }
  },

  mounted() {
    console.log("Header mounted");
     this.handleResize();
      window.addEventListener("resize", this.handleResize);
     
  },

  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
      console.log("this.windowWidth", this.windowWidth);
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
  width: 45px;
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
  left: 10px;
  position: absolute;
  top: 7px;
}

#info-img:hover {
  float: left;
}

#search-input {
  width: 300px !important;
}

@media screen and (max-width: 767px) and (min-width: 574px) {
  // #info-btn {
  //   top: 50px;
  // }
}

@media screen and (max-width: 573px) {
  #info-btn {
    top: 93px;
  }
}
</style>
