function initDemoMap() {
  background_map = L.tileLayer('https://tile.jawg.io/9e47bb8d-efe9-44b4-86c8-e1ca9acbea38/{z}/{x}/{y}{r}.png?access-token=I6EpM0rUPAVxyVtfSFHyZJ6besx7JYPVnVr060qbSzw3g90ZfxhY09cwQYGlRC3f', {});
  
  var map = L.map("map", {
    layers: [background_map]
  });

  return map
}

function generateMap(waves,currents, base, best_route, city_start, city_end) {
  // demo map
  var map = initDemoMap();

  // load data (u, v grids) from somewhere (e.g. https://github.com/danwild/wind-js-server)

/*
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

  */
  var waveLayer =  L.velocityLayer({
      displayValues: true,
      displayOptions: {
         velocityType: "Waves",
         displayPosition: "topright",
         displayEmptyString: "No wave data"
      },
      data: waves,
      velocityScale: 0.005,
      maxVelocity: 1,
      lineWidth: 5,
      particleAge: 60,
      colorScale: [ '#ffffff'],
      mapType: 'waveLayer'
  })
  waveLayer.addTo(map)

  var heat = L.heatLayer([
    [36.419390, -17.566927, 0.2],
    [36.460547, -32.612874, 0.3],
    [36.586265, -53.456290, 0.4],
    [38.204040, -61.425619, 0.5],
    [36.658101, -68.195426, 0.7],
    [40.787861, -68.362122, 0.8],
    [42, -69, 20],
    
  ], {radius: 20, maxZoom:7}).addTo(map);

  //Potting routes and markers
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

