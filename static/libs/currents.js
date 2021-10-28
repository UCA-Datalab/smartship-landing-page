function generateMap(waves, wind, currents, base, best_route, city_start, city_end) {
  var map = L.map("map");

  var background_map = L.tileLayer('https://api.mapbox.com/styles/v1/tr3cks/ckv6iiptd3bke15lh4ioa6lkv/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidHIzY2tzIiwiYSI6ImNrdjZpZnp1eDB2dG4ycW9rMjlmOHY0OHIifQ.egCphR_INbD25yU6Ha4A8w', {}).addTo(map);
  //var background_map = L.tileLayer('https://tile.jawg.io/9e47bb8d-efe9-44b4-86c8-e1ca9acbea38/{z}/{x}/{y}{r}.png?access-token=I6EpM0rUPAVxyVtfSFHyZJ6besx7JYPVnVr060qbSzw3g90ZfxhY09cwQYGlRC3f', {}).addTo(map);

  var currents_layer = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType: "Global Currents",
      position: "bottomleft",
      emptyString: "No currents data"
    },
    colorScale: [
      "#d9843f",
      "#d78039",
      "#d67d33",
      "#d4792d",
      "#d27526",
      "#d0711f",
      "#ce6e18",
      "#cc6a0f",
      "#ca6603"]
    ,
    lineWidth: 1,
    data: currents,
    velocityScale: 1,
    maxVelocity: Math.max(Math.max(currents[0].data), Math.max(currents[1].data)),
    minVelocity: Math.min(Math.min(currents[0].data), Math.min(currents[1].data)),
  });

  var wind_layer = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType: "Global Wind",
      position: "bottomleft",
      emptyString: "No wind data"
    },
    colorScale: ["#fafa6e",
      "#d7f171",
      "#b5e877",
      "#95dd7d",
      "#77d183",
      "#5bc489",
      "#3fb78d",
      "#23aa8f",
      "#009c8f",
      "#008d8c",
      "#007f86",
      "#0b717e",
      "#1c6373",
      "#255566",
      "#2a4858"]
    ,
    lineWidth: 1,
    data: wind,
    velocityScale: 0.03,
    maxVelocity: Math.max(Math.max(wind[0].data), Math.max(wind[1].data)),
    minVelocity: Math.min(Math.min(wind[0].data), Math.min(wind[1].data)),
    particleAge: 180
  });


  // WAVES LAYER
  var waveLayer = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType: "Waves",
      displayPosition: "topright",
      displayEmptyString: "No wave data"
    },
    data: waves.velocity,
    velocityScale: 0.005,
    maxVelocity: 1,
    lineWidth: 5,
    particleAge: 60,
    velocityScale: 0.01,
    colorScale: ['#ffffff'],
    mapType: 'waveLayer',
    maxVelocity: Math.max(Math.max(waves.velocity[0].data), Math.max(waves.velocity[1].data)),
    minVelocity: Math.min(Math.min(waves.velocity[0].data), Math.min(waves.velocity[1].data)),
  })

  //HEATMAP
  var heat = L.heatLayer(waves.height, { radius: 35, maxZoom: 8 });
  var waves_group = L.layerGroup([heat, waveLayer])


  //Potting routes and markers
  var best_r = L.polyline.antPath(best_route, { color: 'green', weight: 2.5, opacity: 0.8, delay: 1000 });
  var base_r = L.polyline.antPath(base, { color: 'red', weight: 2.5, opacity: 1, delay: 1000 });

  var coord_start = base[0]
  var coord_end = base[base.length - 1]

  var init_marker = L.marker(coord_start)
  var end_marker = L.marker(coord_end)

  init_marker.bindPopup("<b>" + city_start + "</b>", { closeOnClick: false, autoClose: false })
  end_marker.bindPopup("<b>" + city_end + "</b>", { closeOnClick: false, autoClose: false })

  var routes_group = L.layerGroup([best_r, base_r, init_marker, end_marker])

  var overlay_layers = {
    "Currents": currents_layer.addTo(map),
    "Wind": wind_layer,
    "Waves": waves_group,
    "Routes": routes_group.addTo(map),
  }

  L.control.layers({}, overlay_layers).addTo(map);

  map.setView([(coord_start[0] + coord_end[0]) / 2, (coord_start[1] + coord_end[1]) / 2], 4.2);

  init_marker.openPopup()
  end_marker.openPopup()

  map.on("overlayadd", function () {
    init_marker.openPopup()
    end_marker.openPopup()
  })
}

