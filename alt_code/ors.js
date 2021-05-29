var isolayer = new VectorLayer({
  title: 'isolayer',
  source: new VectorSource({
    format: new GeoJSON(),
    url: universities_geojson,
  }),
  maxResolution: 15,
  style: new Style({
    fill: new Fill({
      color: 'rgba(121, 131, 242, 0.6)',
    }),
    stroke: new Stroke({
      color: '#1420a3',
      width: 1,
    }),
  }),
});

var outsidercoordinate;

// Popup showing the position the user clicked
var popup = new Overlay({
  element: document.getElementById('popup'),
});
map.addOverlay(popup);

// Click Event for Popup (Work in Progress)
map.on('click', function (evt) {
  var element = popup.getElement();
  var coordinate = evt.coordinate;
  var coords = toLonLat(evt.coordinate);
  window.outsidercoordinate = coords;
  var hdms = toStringHDMS(toLonLat(coordinate));
  console.log(coordinate);
  console.log(coords)
  //console.log(toStringHDMS);

  $(element).popover('dispose');
  popup.setPosition(coordinate);
  $(element).popover({
    container: element,
    placement: 'top',
    animation: false,
    html: true,
    content: '<p>(WORK IN PROGRESS) The location you clicked was:</p><code>' + hdms + '</code>',
  });
  $(element).popover('show');
});

var selected = null;

map.on('pointermove', function (e) {
  if (selected !== null) {
    selected.setStyle(undefined);
    selected = null;
  }

  map.forEachFeatureAtPixel(e.pixel, function (f) {
    selected = f;
    f.setStyle(highlightStyle);
    return true;
  });
});

// API KEY 5b3ce3597851110001cf6248eff557cdb07c480cabced1a36192d99a

document.getElementById('isochroneActivate').onclick = function() {
  var isotransportation = window.rdValue;
  var isotimelimit = document.getElementById('myRange').value;
  var coordinate = window.outsidercoordinate;
  var coordinaterequest = coordinate.toString();
  console.log(coordinaterequest);
  console.log(isotimelimit);
  console.log(coordinate);
  console.log(isotransportation);
  console.log('{"locations":[[' + coordinate.toString() + ']],"range":['+ isotimelimit.toString() + ']"range_type":"time","units":"mi"}');

  var request = require('request');

  request({
    method: 'POST',
    url: 'https://api.openrouteservice.org/v2/isochrones/' + isotransportation,
    body: '{"locations":[[' + coordinate.toString() + ']],"range":['+ isotimelimit.toString() + '],"range_type":"time","units":"mi"}',
    headers: {
      'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
      'Authorization': '5b3ce3597851110001cf6248eff557cdb07c480cabced1a36192d99a',
      'Content-Type': 'application/json; charset=utf-8'
    }}, function (error, response, body) {
    console.log('Status:', response.statusCode);
    console.log('Headers:', JSON.stringify(response.headers));
    console.log(response)
    console.log('Response:', body);
    var isochronejson = GeoJSON.parse(body);
    isolayer.getSource().clear();
    isolayer.getSource().addFeatures(isochronejson);
  });
};


// LAv om med den her?? https://github.com/GIScience/openrouteservice-js