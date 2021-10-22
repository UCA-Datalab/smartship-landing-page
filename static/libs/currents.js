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

function generateMap(currents, base, best_route, city_start, city_end) {
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

  var coord_start = base[0]
  var coord_end = base[base.length - 1]

  var init_marker = L.marker(coord_start).addTo(map)
  var end_marker = L.marker(coord_end).addTo(map)

  init_marker.bindPopup("<b>" + city_start + "</b>").openPopup()
  end_marker.bindPopup("<b>" + city_end + "</b>").openPopup()

  map.setView([(coord_start[0] + coord_end[0]) / 2, (coord_start[1] + coord_end[1]) / 2], 4);
}

