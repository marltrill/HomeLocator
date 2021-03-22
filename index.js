import 'ol/ol.css';
import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import {GeoJSON, WFS, GML3, KML, GML} from 'ol/format';
import {Stroke, Style, Fill} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer, Image as ImageLayer} from 'ol/layer';
import {fromLonLat, toLonLat} from 'ol/proj';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import {toStringHDMS} from 'ol/coordinate';
import {ScaleLine, ZoomToExtent, defaults as defaultControls} from 'ol/control';
import ImageWMS from 'ol/source/ImageWMS';

// Designate Center of Map
const denmarkLonLat = [10.835589, 56.232371];
const denmarkWebMercator = fromLonLat(denmarkLonLat);

// Home Icon for default extent button
var home_icon = document.createElement('span');
home_icon.innerHTML = '<img src="https://image.flaticon.com/icons/png/512/69/69524.png" width="20" height="20">';

// Return to Default Extent Button
var homeExtent = new ZoomToExtent({ // Zoom to Country Extent
  extent: [
    // Uses EPSG 3857 for these coordinates
    836526.837553,
    7249899.258792,
    1726865.343019,
    7959234.881279
  ],
  label: home_icon
});

// Pull Municipalities Boundaries from GitHub
var municipalities = new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    url: "https://raw.githubusercontent.com/Neogeografen/dagi/master/geojson/kommuner.geojson"
  })
});

// Scaleline
var scaleline = new ScaleLine();

// Define layers to be mapped
var layers = [
  new TileLayer({
    source: new OSM(),
  }),
  municipalities
];

// Define map
var map = new Map({
  controls: defaultControls().extend([homeExtent, scaleline]),
  layers: layers,
  view: new View({
    center: denmarkWebMercator,
    zoom: 7
  }),
  target: 'map'
});

// Popup showing the position the user clicked
var popup = new Overlay({
  element: document.getElementById('popup'),
});
map.addOverlay(popup);

// Click Event for Popup
map.on('click', function (evt) {
  var element = popup.getElement();
  var coordinate = evt.coordinate;
  var hdms = toStringHDMS(toLonLat(coordinate));

  $(element).popover('dispose');
  popup.setPosition(coordinate);
  $(element).popover({
    container: element,
    placement: 'top',
    animation: false,
    html: true,
    content: '<p>The location you clicked was:</p><code>' + hdms + '</code>',
  });
  $(element).popover('show');
});