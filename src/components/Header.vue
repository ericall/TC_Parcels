<template>
  <header>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark" style="z-index: 99;">
      <a class="navbar-brand" href="#">TC Parcel</a>
      <div id="navbarNav" class="mx-auto">
        <div v-if="windowWidth >= 768" class="form-inline mx-auto">
          <Search></Search>
        </div>
        <ul class="navbar-nav my-md-0">

       

          <li class="nav-item">
            <button id="info-btn" type="button" class="btn btn-primary">
              <img id="info-img" src="../assets/info.png" />
            </button>
          </li>
        </ul>

            <button v-if="windowWidth < 768" id="mobile-search-btn" type="button" class="btn btn-primary">
            <span class="esri-icon-search"></span>
            <span> Search</span>
            </button>
        
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

#mobile-search-btn {
  position: absolute;
    left: 115px;
    top: 12px;
    color: white;
    font-size: 20px;
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
