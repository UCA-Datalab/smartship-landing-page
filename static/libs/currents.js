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

  return map
}

function generateMap(currents, base, best_route) {
  // demo map
  var map = initDemoMap();

  // load data (u, v grids) from somewhere (e.g. https://github.com/danwild/wind-js-server)


  var velocityLayer = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType: "Global Currents",
      position: "bottomleft",
      emptyString: "No currents data"
    },
    data: currents,
    maxVelocity: Math.max(Math.max(currents[0].data), Math.max(currents[1].data)),
    minVelocity: Math.min(Math.min(currents[0].data), Math.min(currents[1].data)),
  });

  velocityLayer.addTo(map)

  L.polyline(best_route, { color: 'red', weight: 1, opacity: 0.8 }).addTo(map);
  L.polyline(base, { color: 'green', weight: 1, opacity: 1 }).addTo(map);

  map.setView(best_route[Math.floor(best_route.length / 2)], 4);
}

