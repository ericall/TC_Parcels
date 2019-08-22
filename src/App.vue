<template>
  <div style="height: 100%;">
    <Header></Header>
    <Map></Map>
    <Results></Results>
  </div>
</template>

<script>
import { loadCss } from "esri-loader";
loadCss("https://js.arcgis.com/4.10/esri/css/main.css");
import Header from "./components/Header.vue";
import Map from "./components/Map.vue";
import Results from "./components/Results.vue";

export default {
  name: "app",
  components: {
    Header,
    Map,
    Results
  }
};
</script>

<style lang="scss">
@import url("https://js.arcgis.com/4.10/esri/css/main.css");
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 100%;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  height: 100%;
}
</style>
