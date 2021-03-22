import 'ol/ol.css';
import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import {GeoJSON, WFS, GML3, KML, GML} from 'ol/format';
import {Stroke, Style, Fill} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {fromLonLat, toLonLat} from 'ol/proj';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import {toStringHDMS} from 'ol/coordinate';
/**
 * Elements that make up the popup.
 */
 var container = document.getElementById('popup');
 var content = document.getElementById('popup-content');
 var closer = document.getElementById('popup-closer');
 
 /**
  * Create an overlay to anchor the popup to the map.
  */
 var overlay = new Overlay({
   element: container,
   autoPan: true,
   autoPanAnimation: {
     duration: 250,
   },
 });
 
 /**
  * Add a click handler to hide the popup.
  * @return {boolean} Don't follow the href.
  */
 closer.onclick = function () {
   overlay.setPosition(undefined);
   closer.blur();
   return false;
 };

// Designate Center of Map
const denmarkLonLat = [10.835589, 56.232371];
const denmarkWebMercator = fromLonLat(denmarkLonLat);

// Pull Municipalities Boundaries from GitHub
var municipalities = new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    url: "https://raw.githubusercontent.com/Neogeografen/dagi/master/geojson/kommuner.geojson"
  })
});

// Define layers to be mapped
var layers = [
  new TileLayer({
    source: new OSM(),
  }),
  municipalities
];

// Define map
var map = new Map({
  layers: layers,
  view: new View({
    center: denmarkWebMercator,
    zoom: 7
  }),
  target: 'map'
});

/**
 * Add a click handler to the map to render the popup.
 */
 map.on('singleclick', function (evt) {
  var coordinate = evt.coordinate;
  var hdms = toStringHDMS(toLonLat(coordinate));

  content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
  overlay.setPosition(coordinate);
});