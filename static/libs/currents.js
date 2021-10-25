function initDemoMap() {
  var map = L.map("map");

  background_map = L.tileLayer('https://tile.jawg.io/9e47bb8d-efe9-44b4-86c8-e1ca9acbea38/{z}/{x}/{y}{r}.png?access-token=I6EpM0rUPAVxyVtfSFHyZJ6besx7JYPVnVr060qbSzw3g90ZfxhY09cwQYGlRC3f', {});
  /*
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
  */

  var map = L.map("map", {
    layers: [background_map]
  });

  return map
}

function generateMap(currents, base, best_route, city_start, city_end) {
  var map = L.map("map");

  var background_map = L.tileLayer('https://api.mapbox.com/styles/v1/tr3cks/ckv6iiptd3bke15lh4ioa6lkv/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidHIzY2tzIiwiYSI6ImNrdjZpZnp1eDB2dG4ycW9rMjlmOHY0OHIifQ.egCphR_INbD25yU6Ha4A8w', {}).addTo(map);


  var currents_layer = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType: "Global Currents",
      position: "bottomleft",
      emptyString: "No currents data"
    },
    lineWidth: 2,
    data: currents,
    maxVelocity: Math.max(Math.max(currents[0].data), Math.max(currents[1].data)),
    minVelocity: Math.min(Math.min(currents[0].data), Math.min(currents[1].data)),
  });


  var best_r = L.polyline(best_route, { color: 'red', weight: 1.5, opacity: 0.8 });
  var base_r = L.polyline(base, { color: 'green', weight: 1.5, opacity: 1 });

  var coord_start = base[0]
  var coord_end = base[base.length - 1]

  var init_marker = L.marker(coord_start)
  var end_marker = L.marker(coord_end)

  init_marker.bindPopup("<b>" + city_start + "</b>", { closeOnClick: false, autoClose: false })
  end_marker.bindPopup("<b>" + city_end + "</b>", { closeOnClick: false, autoClose: false })

  var routes_group = L.layerGroup([best_r, base_r, init_marker, end_marker])

  var overlay_layers = {
    "Currents": currents_layer.addTo(map),
    "Routes": routes_group.addTo(map),
  }

  L.control.layers({}, overlay_layers).addTo(map);

  map.setView([(coord_start[0] + coord_end[0]) / 2, (coord_start[1] + coord_end[1]) / 2], 4);

  init_marker.openPopup()
  end_marker.openPopup()
}

