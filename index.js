import 'ol/ol.css';
import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import {GeoJSON, WFS} from 'ol/format';
import {Stroke, Style} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {
  and as andFilter,
  equalTo as equalToFilter,
  like as likeFilter,
} from 'ol/format/filter';
import {fromLonLat} from 'ol/proj';
import OSM from 'ol/source/OSM';
import {bbox as bboxStrategy} from 'ol/loadingstrategy';


const denmarkLonLat = [10.835589, 56.232371]
const denmarkWebMercator = fromLonLat(denmarkLonLat)

var layers = [
  new TileLayer({
    source: new OSM(),
  }),
];

new Map({
  layers: [layers, vector],
  view: new View({
    center: denmarkWebMercator,
    zoom: 7
  }),
  target: 'map'
});