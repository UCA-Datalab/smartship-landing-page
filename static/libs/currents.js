function initDemoMap() {

  var Esri_DarkGreyCanvas = L.tileLayer(
    "http://{s}.sm.mapstack.stamen.com/" +
    "(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/" +
    "{z}/{x}/{y}.png",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, " +
        "NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
    }
  );

  var map = L.map("map", {
    layers: [Esri_DarkGreyCanvas]
  });

  map.setView([36, -36], 4);

  return map
}

// demo map
var map = initDemoMap();

// load data (u, v grids) from somewhere (e.g. https://github.com/danwild/wind-js-server)

$.getJSON("static/test_data/currents.json", function (data) {
  var velocityLayer = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType: "Global Currents",
      position: "bottomleft",
      emptyString: "No currents data"
    },
    data: data,
    maxVelocity: Math.max(Math.max(data[0].data), Math.max(data[1].data)),
    minVelocity: Math.min(Math.min(data[0].data), Math.min(data[1].data)),
  });

  velocityLayer.addTo(map)
});