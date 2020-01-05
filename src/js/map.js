import config from "../store/config.json";
import { mapGetters } from "vuex";
import store from "../store/store";

let parcelGraphicLayers;

export default {
 showParcelSelection(geom, GraphicsLayer, Graphic,SimpleFillSymbol) {
     console.log("map.showParcelSelection",geom, GraphicsLayer, Graphic,SimpleFillSymbol);
     this.removeParcelSelection();
    let fill = new SimpleFillSymbol({
        outline: { width: 1.5, color: [0, 255, 197, 4] },
        color: [190, 255, 232, 0.16]
      });

    let parcelGraphic = new Graphic({  // graphic with line geometry
        geometry: geom, // set geometry here
        symbol: fill // set symbol here
      });

      parcelGraphicLayers = new GraphicsLayer({
        graphics: [parcelGraphic]
      });

      config.Map.add(parcelGraphicLayers);
 },

 removeParcelSelection(){
     if (parcelGraphicLayers){
        parcelGraphicLayers.removeAll();
     }
 },

 zoomToFeature(geom){
  var opts = {
    duration: 5000  // Duration of animation will be 5 seconds
  };
  
  // go to point at LOD 15 with custom duration
  config.View.goTo({
    target: geom,
    zoom: 15
  }, opts);
 }
};
