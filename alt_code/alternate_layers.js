var highlightStyle = new Style({
    fill: new Fill({
      color: 'rgba(255,255,255,0.7)',
    }),
    stroke: new Stroke({
      color: '#3399CC',
      width: 3,
    }),
  });

// Add OSM hospitals layer
var hospitals_geojson = require('./data/hospitals_epsg4326.geojson')

var hospitals = new VectorLayer({
  title: 'Hospitals',
  source: new VectorSource({
    format: new GeoJSON(),
    url: hospitals_geojson,
  }),
  maxResolution: 15,
  style: new Style({
    fill: new Fill({
      color: 'rgba(255, 230, 161, 0.6)',
    }),
    stroke: new Stroke({
      color: '#b58604',
      width: 1,
    }),
  }),
});

// Add OSM Schools layer
var schools_geojson = require('./data/schools_epsg4326.geojson')

var schools = new VectorLayer({
  title: 'Schools',
  source: new VectorSource({
    format: new GeoJSON(),
    url: schools_geojson,
  }),
  maxResolution: 15,
  style: new Style({
    fill: new Fill({
      color: 'rgba(216, 193, 227, 0.6)',
    }),
    stroke: new Stroke({
      color: '#ad31e8',
      width: 1,
    }),
  }),
});

// Add OSM Leisure/Parks layer
var leisureparks_geojson = require('./data/leisureparks_epsg4326.geojson')

var leisureparks = new VectorLayer({
  title: 'Leisure/Parks',
  source: new VectorSource({
    format: new GeoJSON(),
    url: leisureparks_geojson,
  }),
  maxResolution: 15,
  style: new Style({
    fill: new Fill({
      color: 'rgba(173, 237, 182, 0.6)',
    }),
    stroke: new Stroke({
      color: '#08961b',
      width: 1,
    }),
  }),
});

// Add Universities from GitHub
var universities_geojson = require('./data/universities_epsg4326.geojson')

var universities = new VectorLayer({
  title: 'Universities',
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