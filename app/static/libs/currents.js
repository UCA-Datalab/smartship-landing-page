var overlay_layers = null;
var first_time = true;
var control_layer = null;

L.Control.Layers.include({
  getOverlays: function () {
    // create hash to hold all layers
    var control, layers;
    layers = {};
    control = this;

    // loop thru all layers in control
    control._layers.forEach(function (obj) {
      var layerName;

      // check if layer is an overlay
      if (obj.overlay) {
        // get name of overlay
        layerName = obj.name;
        // store whether it's present on the map or not
        return layers[layerName] = control._map.hasLayer(obj.layer);
      }
    });

    return layers;
  }
});

function prepare_wind(wind) {
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
    particleAge: 180,
    paneName: "wind"
  });

  return wind_layer;
}

function prepare_currents(currents) {
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

  return currents_layer;
}

function prepare_waves(waves, first_time) {
  // WAVES LAYER
  var waveLayer = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType: "Waves",
      displayPosition: "topright",
      displayEmptyString: "No wave data"
    },
    data: waves.velocity,
    maxVelocity: 1,
    lineWidth: 6,
    particleAge: 60,
    velocityScale: 0.005,
    colorScale: ['#ffffff'],
    mapType: 'waveLayer',
    maxVelocity: Math.max(Math.max(waves.velocity[0].data), Math.max(waves.velocity[1].data)),
    minVelocity: Math.min(Math.min(waves.velocity[0].data), Math.min(waves.velocity[1].data)),
  })

  // ==== HEATMAP ==== 
  var heat_gradient = { 1: "#FF0000", .8: "#FFFF00", .7: "#00FF00", .6: "#00FFFF", .4: "#0000FF" }

  var cfg = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    // if scaleRadius is false it will be the constant radius used in pixels
    "radius": 6,
    //"maxOpacity": 1,
    //"maxOpacity": 0.5,
    //"opacity": 0.6,
    // scales the radius based on map zoom
    "scaleRadius": true,
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries
    //   (there will always be a red spot with useLocalExtremas true)
    "useLocalExtrema": false,
    // which field name in your data represents the latitude - default "lat"
    latField: 'lat',
    // which field name in your data represents the longitude - default "lng"
    lngField: 'lon',
    // which field name in your data represents the data value - default "value"
    valueField: 'height',
    blur: 1,
    gradient: heat_gradient
  };


  var heat = new HeatmapOverlay(cfg);
  heat.setData(waves.height)

  // LEGEND
  if (first_time) {
    var heat_legend = L.control({ position: 'bottomright' });
    heat_legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend');
      div.innerHTML += '<b>Waves height (m)</b>';
      div.innerHTML += '<div class="nums"><i>0</i><i>' + waves.height.max + '</i></div>'
      var canvas = L.DomUtil.create('canvas');

      var ctx = canvas.getContext('2d');
      var gradient = ctx.createLinearGradient(20, 0, 220, 0);

      for (let k in heat_gradient) {
        gradient.addColorStop(k, heat_gradient[k]);
      }

      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(0, 0, 300, 20);


      div.appendChild(canvas)
      return div;
    };

    map.on('overlayadd', function (eventLayer) {
      // Switch to the Population legend...
      if (eventLayer.name === 'Waves')
        heat_legend.addTo(this);
    });

    map.on('overlayremove', function (eventLayer) {
      // Switch to the Population legend...
      if (eventLayer.name === 'Waves')
        this.removeControl(heat_legend);
    });
  }

  return L.layerGroup([heat, waveLayer])
}

function date_between(dt, prev, next) {
  return (
    (dt.getFullYear() > prev.getFullYear() ||
      dt.getMonth() > prev.getMonth() ||
      dt.getDate() > prev.getDate()) &&
    (dt.getFullYear() <= next.getFullYear() &&
      dt.getMonth() <= next.getMonth() &&
      dt.getDate() <= next.getDate())
  )
}

function limit_route(route, timestamps, min_day, max_day) {
  var route_today = [];
  var index = 0;
  timestamps.forEach(e => {
    var dt = new Date(e);
    if (date_between(dt, min_day, max_day))
      route_today.push(route[index]);
    index++;
  });

  return route_today;
}

function insert_data(parameters) {
  label = parameters.label;
  value = parameters.value;
  map = parameters.map;
  waves = parameters.waves;
  wind = parameters.wind;
  currents = parameters.currents;
  base_data = parameters.base_data;
  best_data = parameters.best_data;
  city_start = parameters.city_start;
  city_end = parameters.city_end;
  indexing_routes = parameters.indexing_routes
  all_days = parameters.all_days


  // ===== OCEANOGRAPHIC DATA =====
  wind_layer = prepare_wind(wind[value - 1])
  currents_layer = prepare_currents(currents[value - 1])
  waves_group = prepare_waves(waves[value - 1], first_time)

  // ===== ROUTES =====
  var curr_day = new Date(label);

  var prev_day;
  if (value == 1) {
    prev_day = new Date(best_data.timestamps[0])
    prev_day.setDate(prev_day.getDate() - 1)
  }
  else prev_day = new Date(all_days[value - 2]);

  // Get routes of the selected day
  var best_route_today = limit_route(best_data.coords, best_data.timestamps, prev_day, curr_day);
  var base_route_today = limit_route(base_data.coords, base_data.timestamps, prev_day, curr_day);

  // Draw routes
  var best_poly = L.polyline.antPath(best_data.coords, { color: '#3e59b5', weight: 1.4, opacity: 0.6, delay: 500, dashArray: [3, 40], pane: 'routes' });
  var best_poly_today = L.polyline.antPath(best_route_today, { color: '#2D4287', weight: 3, opacity: 1, delay: 500, dashArray: [3, 40], pane: 'routes' });
  var base_poly = L.polyline.antPath(base_data.coords, { color: '#cc4902', weight: 1.4, opacity: 0.6, delay: 500, dashArray: [2, 40], pane: 'routes' });
  var base_poly_today = L.polyline.antPath(base_route_today, { color: '#cc4902', weight: 3, opacity: 1, delay: 500, dashArray: [2, 40], pane: 'routes' });

  // Generate markers
  var index = 0;
  var base_markers = [];
  indexing_routes.forEach(route_index => {
    if (index > 0 && index < indexing_routes.length - 1) {
      var latLng = base_data.coords[route_index]
      var popup_text = "<b> Waves: " + base_data.waves[route_index].toFixed(2) + "</b> <br> <b>Currents: " + base_data.currents[route_index].toFixed(2) + "</b> <br> <b>Wind: " + base_data.wind[route_index].toFixed(2) + "</b>"

      if (base_route_today.includes(latLng)) radius = 3
      else radius = 2

      var marker = L.circleMarker(
        latLng,
        {
          color: "#cc4902",
          radius: radius,
          fillOpacity: true,
          pane: 'routes',
        }
      ).bindPopup(popup_text, { pane: "popups" })

      marker.on('mouseover', function (e) {
        this.openPopup();
      });
      marker.on('mouseout', function (e) {
        this.closePopup();
      });

      base_markers.push(marker);
    }

    index++;

  });

  base_markers.unshift(base_poly);
  base_markers.unshift(base_poly_today);

  var index = 0;
  var best_markers = [];
  indexing_routes.forEach(route_index => {
    if (index > 0 && index < indexing_routes.length - 1) {
      var latLng = best_data.coords[route_index]
      var popup_text = "<b> Waves: " + best_data.waves[route_index].toFixed(2) + "</b> <br> <b>Currents: " + best_data.currents[route_index].toFixed(2) + "</b> <br> <b>Wind: " + best_data.wind[route_index].toFixed(2) + "</b>"

      if (base_route_today.includes(latLng)) {
        radius = 3
        color = "#2D4287"
      }
      else {
        radius = 2
        color = "#3e59b5"
      }

      var marker = L.circleMarker(
        latLng,
        {
          color: color,
          radius: radius,
          fillOpacity: true,
          pane: 'routes',
        }
      ).bindPopup(popup_text, { pane: "popups" })

      marker.on('mouseover', function (e) {
        this.openPopup();
      });
      marker.on('mouseout', function (e) {
        this.closePopup();
      });

      best_markers.push(marker);
    }

    index++;

  });

  best_markers.push(best_poly)
  best_markers.push(best_poly_today)

  var routes_group_array = base_markers.concat(best_markers)

  var init_marker = L.marker(base_data.coords[0], { pane: 'routes' })
  var end_marker = L.marker(base_data.coords.at(-1), { pane: 'routes' })

  init_marker.bindPopup("<b>" + city_start + "</b>", { closeOnClick: false, autoClose: false, pane: "popups" })
  end_marker.bindPopup("<b>" + city_end + "</b>", { closeOnClick: false, autoClose: false, pane: "popups" });

  routes_group_array.unshift(init_marker)
  routes_group_array.unshift(end_marker)

  var routes_group = L.layerGroup(routes_group_array)

  var layers_activated = null;
  if (!first_time) {
    layers_activated = control_layer.getOverlays();

    for (var name in overlay_layers) {
      map.removeLayer(overlay_layers[name]);
    }

    control_layer.remove(map);
  }
  else
    layers_activated = { "Currents": true, "Wind": false, "Waves": false, "Routes": true };

  overlay_layers = {
    "Currents": currents_layer,
    "Wind": wind_layer,
    "Waves": waves_group,
    "Routes": routes_group
  }

  for (var key in overlay_layers) {
    if (layers_activated[key])
      overlay_layers[key].addTo(map);
  }

  control_layer = L.control.layers({}, overlay_layers).addTo(map);

  init_marker.openPopup()
  end_marker.openPopup()
  map.on("overlayadd", function () {
    init_marker.openPopup()
    end_marker.openPopup()
  })

  first_time = false
}

function generateMap(waves, wind, currents, base_data, best_data, city_start, city_end, geo_json_string, days, indexing_routes) {
  $("#map").addClass("leaflet-container leaflet-touch leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom");
  $('#map_preloader').hide("slow");

  var map = L.map("map");
  document.getElementById("map").style.background = "#a0c7ee";

  map.createPane('continents');
  map.getPane('continents').style.zIndex = 650;
  map.getPane('continents').style.pointerEvents = 'none';

  map.createPane('countries');
  map.getPane('countries').style.zIndex = 675;
  map.getPane('countries').style.pointerEvents = 'none';

  map.createPane('wind');
  map.getPane('wind').style.zIndex = 700;
  map.getPane('wind').style.pointerEvents = 'none';

  map.createPane('routes');
  map.getPane('routes').style.zIndex = 725;
  map.getPane('routes').style.pointerEvents = 'none';

  map.createPane('popups');
  map.getPane('popups').style.zIndex = 750;
  map.getPane('popups').style.pointerEvents = 'none';

  L.tileLayer(
    'https://api.mapbox.com/styles/v1/tr3cks/ckvlgrqmt23nb14pihew0rvoa/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidHIzY2tzIiwiYSI6ImNrdjZpZnp1eDB2dG4ycW9rMjlmOHY0OHIifQ.egCphR_INbD25yU6Ha4A8w',
    { pane: 'countries' }
  ).addTo(map);

  L.geoJSON(geo_json_string, { pane: 'continents', style: { fillColor: "#c5def6", fillOpacity: 1, opacity: 0 } }).addTo(map);


  var days_cleaned = []
  days.forEach((e) => {
    var dt = new Date(e);
    days_cleaned.push(dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate());
  });

  L.control.timelineSlider({
    timelineItems: days_cleaned,
    extraChangeMapParams: {
      waves: waves,
      wind: wind,
      currents: currents,
      base_data: base_data,
      best_data: best_data,
      city_start: city_start,
      city_end: city_end,
      indexing_routes: indexing_routes,
      all_days: days_cleaned
    },
    changeMap: insert_data,
    activeColor: "#85b24a",
    inactiveColor: "#384f97"
  }).addTo(map);

  var coord_start = base_data.coords[0]
  var coord_end = base_data.coords.at(-1)

  map.setView([(coord_start[0] + coord_end[0]) / 2, (coord_start[1] + coord_end[1]) / 2], 4.2);
  map.options.minZoom = 3;
  map.options.maxZoom = 6;
  map.setMaxBounds(bounds);

  var bounds = new L.LatLngBounds(new L.LatLng(-89.98155760646617, -180), new L.LatLng(89.99346179538875, 180));
  map.on('drag', function () {
    map.panInsideBounds(bounds, { animate: false });
  });
}