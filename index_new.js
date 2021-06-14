import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';

import Map from 'ol/Map';
import View from 'ol/View';
import {GeoJSON} from 'ol/format';
import {Text, Style, Stroke, Fill} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer, Group} from 'ol/layer';
import {fromLonLat} from 'ol/proj';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import {ScaleLine, ZoomToExtent, defaults as defaultControls, FullScreen} from 'ol/control';
import TopoJSON from 'ol/format/TopoJSON';
import Geocoder from 'ol-geocoder';
import LayerSwitcher from 'ol-layerswitcher';
import {Vector as VectorSource} from 'ol/source';
import XYZ from 'ol/source/XYZ';
import VectorImageLayer from 'ol/layer/VectorImage';

/**
 * Elements that make up the popup.
 */
 var container = document.getElementById('popup');
 var content_element = document.getElementById('popup-content');
 var info_element = document.getElementById('info-element');
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
const denmarkLonLat = [10.663375, 55.601306]; //10.835589, 56.232371
const denmarkWebMercator = fromLonLat(denmarkLonLat);

// 100km Grid Styling
var classification_search_100km = function (feature, resolution){
  const fuzzyvalue = feature.get('fuzzyvalue')
  var layercolor
  if (fuzzyvalue < 0.2) {
    layercolor='rgba(217, 200, 0, 0.6)';
    }
    else if (fuzzyvalue < 0.4) {
    layercolor='rgba(133, 200, 0, 0.6)';
    }
    else if (fuzzyvalue < 0.6) {
    layercolor='rgba(0, 200, 0, 0.6)';
    }
    else if (fuzzyvalue < 0.8) {
    layercolor='rgba(0, 150, 0, 0.6)';
    }
    else if (fuzzyvalue <= 1) {
    layercolor='rgba(0, 100, 0, 0.6)';
    }
  else {layercolor='rgb(0,0,0,0)';
    }
  return new Style({
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0)',
      width: 0.1
    }),
    fill: new Fill({
      color: layercolor
    })
  })
};

// 30km Grid Styling
var classification_search_30km = function (feature, resolution){
  const fuzzyvalue = feature.get('fuzzyvalue')
  var layercolor
  if (fuzzyvalue < 0.2) {
    layercolor='rgba(217, 200, 0, 0.6)';
    }
    else if (fuzzyvalue < 0.4) {
    layercolor='rgba(133, 200, 0, 0.6)';
    }
    else if (fuzzyvalue < 0.6) {
    layercolor='rgba(0, 200, 0, 0.6)';
    }
    else if (fuzzyvalue < 0.8) {
    layercolor='rgba(0, 150, 0, 0.6)';
    }
    else if (fuzzyvalue <= 1) {
    layercolor='rgba(0, 100, 0, 0.6)';
    }
  else {layercolor='rgb(0,0,0,0)';
    }
  return new Style({
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0)',
      width: 0.1
    }),
    fill: new Fill({
      color: layercolor
    })
  })
};

// 1km Grid Styling
var classification_search_1km = function (feature, resolution){
  const fuzzyvalue = feature.get('fuzzyvalue')
  var layercolor
  if (fuzzyvalue < 0.2) {
    layercolor='rgba(217, 200, 0, 0.6)';
    }
    else if (fuzzyvalue < 0.4) {
    layercolor='rgba(133, 200, 0, 0.6)';
    }
    else if (fuzzyvalue < 0.6) {
    layercolor='rgba(0, 200, 0, 0.6)';
    }
    else if (fuzzyvalue < 0.8) {
    layercolor='rgba(0, 150, 0, 0.6)';
    }
    else if (fuzzyvalue <= 1) {
    layercolor='rgba(0, 100, 0, 0.6)';
    }
    else {layercolor='rgb(0,0,0,0)';
    }
  return new Style({
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0)',
      width: 0.1
    }),
    fill: new Fill({
      color: layercolor
    })
  })
};

// Municipalities Boundary Style
var style = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.6)'
  }),
  stroke: new Stroke({
    color: '#319FD3',
    width: 1
  }),
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: '#000'
    }),
    stroke: new Stroke({
      color: '#fff',
      width: 3
    })
  })
});

// DK Boundary Style
var dk_style = new Style({
  fill: new Fill({
    color: 'rgba(220, 241, 247, 0.6)'
  }),
  stroke: new Stroke({
    color: '#319FD3',
    width: 1
  }),
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: '#000'
    }),
    stroke: new Stroke({
      color: '#fff',
      width: 3
    })
  })
});

// Regions Boundary
var dk_boundary = new VectorLayer({
  title: 'Regions',
  visible: true,
  source: new VectorSource({
    format: new TopoJSON(),
    url: "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/denmark/denmark-counties.json",
  }),
  style: function(feature) {
    dk_style.getText().setText(feature.get('NAME_1'));
    return dk_style;
  },
  minResolution: 401,
});

// Pull Municipalities Boundaries from GitHub
var municipalities = new VectorLayer({
  title: 'Municipalities',
  visible: false,
  source: new VectorSource({
    format: new GeoJSON(),
    url: "https://raw.githubusercontent.com/Neogeografen/dagi/master/geojson/kommuner.geojson",
  }),
  style: function(feature) {
    style.getText().setText(feature.get('KOMNAVN'));
    return style;
  },
  minResolution: 15,
  maxResolution: 400,
});

//Add OSM Schools layer (Purple)
var schools_geojson = require('./data/schools.geojson')

var schools = new VectorLayer({
  title: 'Schools',
  visible: false,
  source: new VectorSource({
    format: new GeoJSON(),
    url: schools_geojson,
  }),
  maxResolution: 100,
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

// Add Universities layer (Blue)
var universities_geojson = require('./data/universities.geojson')

var universities = new VectorLayer({
  title: 'Universities',
  visible: false,
  source: new VectorSource({
    format: new GeoJSON(),
    url: universities_geojson,
  }),
  maxResolution: 100,
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

// Add Cinemas layer (Red)
var cinemas_geojson = require('./data/cinemas.geojson')

var cinemas = new VectorLayer({
  title: 'Cinemas',
  visible: false,
  source: new VectorSource({
    format: new GeoJSON(),
    url: cinemas_geojson,
  }),
  maxResolution: 100,
  style: new Style({
    fill: new Fill({
      color: 'rgba(255, 0, 0, 0.5)',
    }),
    stroke: new Stroke({
      color: '#ff0000',
      width: 1,
    }),
  }),
});

// // Add Kindergartens layer (Aqua)
var kindergartens_geojson = require('./data/kindergartens.geojson')

var kindergartens = new VectorLayer({
  title: 'Kindergartens',
  visible: false,
  source: new VectorSource({
    format: new GeoJSON(),
    url: kindergartens_geojson,
  }),
  maxResolution: 100,
  style: new Style({
    fill: new Fill({
      color: 'rgba(0, 255, 255, 0.5)',
    }),
    stroke: new Stroke({
      color: '#00ffff',
      width: 1,
    }),
  }),
});

// Public Transport Stations (Lime)
var pt_stations_geojson = require('./data/pt_stations.geojson')

var pt_stations = new VectorLayer({
  title: 'Public Transport Stations',
  visible: false,
  source: new VectorSource({
    format: new GeoJSON(),
    url: pt_stations_geojson,
  }),
  maxResolution: 100,
  style: new Style({
    fill: new Fill({
      color: 'rgba(0, 255, 0, 0.5)',
    }),
    stroke: new Stroke({
      color: '#bfff00',
      width: 1,
    }),
  }),
});

//  Theatres (Pink)
var theatres_geojson = require('./data/theatres.geojson')

var theatres = new VectorLayer({
  title: 'Theatres',
  visible: false,
  source: new VectorSource({
    format: new GeoJSON(),
    url: theatres_geojson,
  }),
  maxResolution: 100,
  style: new Style({
    fill: new Fill({
      color: 'rgba(255, 193, 193, 0.5)',
    }),
    stroke: new Stroke({
      color: '#ffclcl',
      width: 1,
    }),
  }),
});

// Industries (Dark Green)
var industries_geojson = require('./data/industries.geojson')

var industries = new VectorLayer({
  title: 'Industries',
  visible: false,
  source: new VectorSource({
    format: new GeoJSON(),
    url: industries_geojson,
  }),
  maxResolution: 100,
  style: new Style({
    fill: new Fill({
      color: 'rgba(0, 135, 68, 0.5)',
    }),
    stroke: new Stroke({
      color: '#008744',
      width: 1,
    }),
  }),
});

// Supermarkets (Light Blue)
var supermarkets_geojson = require('./data/supermarkets.geojson')

var supermarkets = new VectorLayer({
  title: 'Supermarkets',
  visible: false,
  source: new VectorSource({
    format: new GeoJSON(),
    url: supermarkets_geojson,
  }),
  maxResolution: 100,
  style: new Style({
    fill: new Fill({
      color: 'rgba(51, 153, 255, 0.5)',
    }),
    stroke: new Stroke({
      color: '#3399ff',
      width: 1,
    }),
  }),
});

// Add OSM hospitals layer (Orange)
var hospitals_geojson = require('./data/hospitals.geojson')

var hospitals = new VectorLayer({
  title: 'Hospitals',
  visible: false,
  source: new VectorSource({
    format: new GeoJSON(),
    url: hospitals_geojson,
  }),
  maxResolution: 100,
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

/*
//Add Political Party Layer (THIS FILE IS TOO BIG- And need to be more creative with the style)
var politics_geojson = require('./data/crimes_politics.geojson')

var politics = new VectorLayer({
  title: 'Political Party- 2017',
  source: new VectorSource({
    format: new GeoJSON(),
    url: politics_geojson,
  }),
  style: function(feature) {
    style.getText().setText(feature.get('political_'));
    return style;
  },
  minResolution: 100,
});
*/

/*
// Add Water Bodies layer (Dark Blue)
var waterbodies_geojson = require('./data/waterbodies.geojson')

var waterbodies = new VectorLayer({
  title: 'Water Bodies',
  visible: false,
  source: new VectorSource({
    format: new GeoJSON(),
    url: waterbodies_geojson,
  }),
  maxResolution: 100,
  style: new Style({
    fill: new Fill({
      color: 'rgba(0, 0, 204, 0.5)',
    }),
    stroke: new Stroke({
      color: '#0000cc',
      width: 1,
    }),
  }),
});
*/

// Roads (White)
var roads_geojson = require('./data/roads.geojson')

var roads = new VectorLayer({
  title: 'Roads',
  visible: false,
  source: new VectorSource({
    format: new GeoJSON(),
    url: roads_geojson,
  }),
  maxResolution: 1000,
  style: new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.5)',
    }),
    stroke: new Stroke({
      color: '#ffffff',
      width: 3,
    }),
  }),
});

// Public Transport Stops (White)
var pt_stops_geojson = require('./data/pt_stops.geojson')

var pt_stops = new VectorLayer({
  title: 'Public Transport Stops',
  visible: false,
  source: new VectorSource({
    format: new GeoJSON(),
    url: pt_stops_geojson,
  }),
  maxResolution: 100,
  style: new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.5)',
    }),
    stroke: new Stroke({
      color: '#ffffff',
      width: 1,
    }),
  }),
});

// Add Restaurants layer (Yellow)
var restaurants_geojson = require('./data/restaurants.geojson')

var restaurants = new VectorLayer({
  title: 'Restaurants',
  visible: false,
  source: new VectorSource({
    format: new GeoJSON(),
    url: restaurants_geojson,
  }),
  maxResolution: 100,
  style: new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 0, 0.5)',
    }),
    stroke: new Stroke({
      color: '#ffff00',
      width: 1,
    }),
  }),
});

// Add OSM Leisure Parks layer (Green)
var leisureparks_geojson = require('./data/leisureparks.geojson')

var leisureparks = new VectorLayer({
  title: 'Leisure Parks',
  visible: false,
  source: new VectorSource({
    format: new GeoJSON(),
    url: leisureparks_geojson,
  }),
  maxResolution: 100,
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

/*

WEIGHTED GRIDS

*/

// Add Weighted Grid (100km Resolution)
var grid100km_geojson = require('./data/grid100km_aq_p.geojson')

var grid100km = new VectorLayer({
  title: 'Weighted Grid (100km)',
  source: new VectorSource({
    format: new GeoJSON(),
    url: grid100km_geojson,
  }),
  minResolution: 400,
  style: classification_search_100km
});

// Add Weighted Grid (30km Resolution)
var grid30km_geojson = require('./data/grid30km_aq_p.geojson')

var grid30km = new VectorLayer({
  title: 'Weighted Grid (30km)',
  source: new VectorSource({
    format: new GeoJSON(),
    url: grid30km_geojson,
  }),
  minResolution: 100,
  maxResolution: 400,
  style: classification_search_30km
});

// Hovestadden VectorImage
var grid1km_vectorimage_hovestad_geojson = require('./data/weighted_grid1km_hovestad.geojson')

var grid1km_vectorimage_hovestad = new VectorImageLayer({
  title: 'Hovedstadden VectorImage',
  imageRatio: 2,
  source: new VectorSource({
    url: grid1km_vectorimage_hovestad_geojson,
    format: new GeoJSON(),
  }),
  visible: true,
  maxResolution: 100,
  style: classification_search_1km,
});

// Fyn VectorImage
var grid1km_vectorimage_fyn_geojson = require('./data/weighted_grid1km_Fyn.geojson')

var grid1km_vectorimage_fyn = new VectorImageLayer({
  title: 'Fyn VectorImage',
  imageRatio: 2,
  source: new VectorSource({
    url: grid1km_vectorimage_fyn_geojson,
    format: new GeoJSON(),
  }),
  visible: true,
  maxResolution: 100,
  style: classification_search_1km,
});


// Midtjylland VectorImage
var grid1km_vectorimage_midtjylland_geojson = require('./data/weighted_grid1km_Midtjylland.geojson')

var grid1km_vectorimage_midtjylland = new VectorImageLayer({
  title: 'Midtjylland VectorImage',
  imageRatio: 2,
  source: new VectorSource({
    url: grid1km_vectorimage_midtjylland_geojson,
    format: new GeoJSON(),
  }),
  visible: true,
  maxResolution: 100,
  style: classification_search_1km,
});

// Midtjylland West VectorImage
var grid1km_vectorimage_midtjyllandw_geojson = require('./data/weighted_grid1km_MidtjyllandW.geojson')

var grid1km_vectorimage_midtjyllandw = new VectorImageLayer({
  title: 'Midtjylland West VectorImage',
  imageRatio: 2,
  source: new VectorSource({
    url: grid1km_vectorimage_midtjyllandw_geojson,
    format: new GeoJSON(),
  }),
  visible: true,
  maxResolution: 100,
  style: classification_search_1km,
});

/*
// Nordjylland VectorImage
var grid1km_vectorimage_nordjylland_geojson = require('./data/weighted_grid1km_Nordjylland.geojson')

var grid1km_vectorimage_nordjylland = new VectorImageLayer({
  title: 'Nordjylland VectorImage',
  imageRatio: 2,
  source: new VectorSource({
    url: grid1km_vectorimage_nordjylland_geojson,
    format: new GeoJSON(),
  }),
  visible: true,
  maxResolution: 100,
  style: classification_search_1km,
});
*/

// Sjælland VectorImage
var grid1km_vectorimage_sjælland_geojson = require('./data/weighted_grid1km_Sjælland.geojson')

var grid1km_vectorimage_sjælland = new VectorImageLayer({
  title: 'Sjælland VectorImage',
  imageRatio: 2,
  source: new VectorSource({
    url: grid1km_vectorimage_sjælland_geojson,
    format: new GeoJSON(),
  }),
  visible: true,
  maxResolution: 100,
  style: classification_search_1km,
});

/*
// Syddanmark VectorImage
var grid1km_vectorimage_syddanmark_geojson = require('./data/weighted_grid1km_Syddanmark.geojson')

var grid1km_vectorimage_syddanmark = new VectorImageLayer({
  title: 'Syddanmark VectorImage',
  imageRatio: 2,
  source: new VectorSource({
    url: grid1km_vectorimage_syddanmark_geojson,
    format: new GeoJSON(),
  }),
  visible: true,
  maxResolution: 100,
  style: classification_search_1km,
});
*/

// Scaleline
var scaleline = new ScaleLine();

// Legend/Layer Visibilty
var layerSwitcher = new LayerSwitcher({
  reverse: true,
  groupSelectStyle: 'group'
});

var key = 'XtxbqBNbF5eQwYXV37Ym'; // ABP's Key
var attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a> ' +
  '<a href="https://eng.sdfe.dk/" target="_blank">&copy; SDFE</a> ';

// Define layers to be mapped
var layers = [
  // Basemaps
  new Group({
    title: 'Basemap',
    fold: 'open',
    layers: [
      new TileLayer({
        title: 'OpenStreetMap',
        source: new OSM(),
        type: 'base'
      }),
      new TileLayer({
        title: 'MapTiler',
        source: new XYZ({
          attributions: attributions,
          url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
          maxZoom: 20,
          crossOrigin: '',
        }),
        type: 'base'
      }),
    ]
  }),
  // Data layers
  new Group({
    title: 'Map Layers',
    layers: [
      new Group({
        title: 'Criteria Grids',
        layers: [
          grid100km,
          grid30km,
          grid1km_vectorimage_hovestad,
          grid1km_vectorimage_fyn,
          grid1km_vectorimage_midtjylland,
          grid1km_vectorimage_midtjyllandw,
          //grid1km_vectorimage_nordjylland,
          grid1km_vectorimage_sjælland,
          //grid1km_vectorimage_syddanmark
        ],
        fold: 'close',
      }),
      new Group({
        title: 'Data',
        layers: [
          universities,
          municipalities,
          hospitals,
          schools,
          leisureparks,
          cinemas,
          restaurants,
          kindergartens,
          pt_stops,
          pt_stations,
          roads,
          theatres,
          industries,
          supermarkets,
          //waterbodies,
          //politics,
          dk_boundary,
        ],
        fold: 'close',
      }),
    ]
  })
];

// Instantiate Geocoder.
var geocoder = new Geocoder('nominatim', {
  provider: 'osm',
  lang: 'en',
  placeholder: 'Enter Address (Denmark Only)...',
  limit: 5,
  keepOpen: false,
  debug: true,
  autoComplete: true,
  countrycodes: 'dk'
});

// Display pin for geocoding result.
geocoder.getLayer().setVisible(true);

// Define map view.
var mapView = new View({
  center: denmarkWebMercator,
  zoom: 7
});

// Define map
var map = new Map({
  controls: defaultControls().extend([scaleline, geocoder, layerSwitcher, new FullScreen(), new ZoomToExtent({
    extent: [
      644247.2179725806,
      7066697.228365138,
      1768177.2818778122,
      8142930.58662042],
  })]),
  layers: layers,
  view: mapView,
  target: 'map'
});

/*
DEFINE & UPDATE SLIDERS
*/

// Universities Slider
var sliderUni = document.getElementById("uniDistance");
var outputUni = document.getElementById("outUni");
outputUni.innerHTML = sliderUni.value;

// Update slider value
sliderUni.oninput = function() {
  outputUni.innerHTML = this.value;
};

// School Slider
var sliderSchools = document.getElementById("schoolDistance");
var outputSchools = document.getElementById("outSchool");
outputSchools.innerHTML = sliderSchools.value;

// Update slider value
sliderSchools.oninput = function() {
  outputSchools.innerHTML = this.value;
};

// Parks Slider
var sliderParks = document.getElementById("parksDistance");
var outputParks = document.getElementById("outParks");
outputParks.innerHTML = sliderParks.value;

// Update slider value
sliderParks.oninput = function() {
  outputParks.innerHTML = this.value;
};

// Roads Slider
var sliderRoads = document.getElementById("roadsDistance");
var outputRoads = document.getElementById("outRoads");
outputRoads.innerHTML = sliderRoads.value;

// Update slider value
sliderRoads.oninput = function() {
  outputRoads.innerHTML = this.value;
};

// Coastlines Slider
var sliderCoasts = document.getElementById("coastDistance");
var outputCoasts = document.getElementById("outCoast");
outputCoasts.innerHTML = sliderCoasts.value;

// Update slider value
sliderCoasts.oninput = function() {
  outputCoasts.innerHTML = this.value;
};

// Hospitals Slider
var sliderHospitals = document.getElementById("hospitalsDistance");
var outputHospitals = document.getElementById("outHospitals");
outputHospitals.innerHTML = sliderHospitals.value;

// Update slider value
sliderHospitals.oninput = function() {
  outputHospitals.innerHTML = this.value;
};

// Supermarkets Slider
var sliderMarkets = document.getElementById("marketsDistance");
var outputMarkets = document.getElementById("outMarkets");
outputMarkets.innerHTML = sliderMarkets.value;

// Update slider value
sliderMarkets.oninput = function() {
  outputMarkets.innerHTML = this.value;
};

// Water Bodies Slider
var sliderWater = document.getElementById("waterDistance");
var outputWater = document.getElementById("outWater");
outputWater.innerHTML = sliderWater.value;

// Update slider value
sliderWater.oninput = function() {
  outputWater.innerHTML = this.value;
};

// Public Transport Stops Slider
var sliderPstops = document.getElementById("pstopsDistance");
var outputPstops = document.getElementById("outPstops");
outputPstops.innerHTML = sliderPstops.value;

// Update slider value
sliderPstops.oninput = function() {
  outputPstops.innerHTML = this.value;
};

// Public Transport Stations Slider
var sliderPstations = document.getElementById("pstationsDistance");
var outputPstations = document.getElementById("outPstations");
outputPstations.innerHTML = sliderPstations.value;

// Update slider value
sliderPstations.oninput = function() {
  outputPstations.innerHTML = this.value;
};

// Restuarants Slider
var sliderRestuarants = document.getElementById("restuarantsDistance");
var outputRestuarants = document.getElementById("outRestuarants");
outputRestuarants.innerHTML = sliderRestuarants.value;

// Update slider value
sliderRestuarants.oninput = function() {
  outputRestuarants.innerHTML = this.value;
};

// Theatres Slider
var sliderTheatres = document.getElementById("theatreDistance");
var outputTheatres = document.getElementById("outTheatre");
outputTheatres.innerHTML = sliderTheatres.value;

// Update slider value
sliderTheatres.oninput = function() {
  outputTheatres.innerHTML = this.value;
};

// Cinemas Slider
var sliderCinemas = document.getElementById("cinemasDistance");
var outputCinemas = document.getElementById("outCinemas");
outputCinemas.innerHTML = sliderCinemas.value;

// Update slider value
sliderCinemas.oninput = function() {
  outputCinemas.innerHTML = this.value;
};

// Kindergarten Slider
var sliderKinder = document.getElementById("kinderDistance");
var outputKinder = document.getElementById("outKinder");
outputKinder.innerHTML = sliderKinder.value;

// Update slider value
sliderKinder.oninput = function() {
  outputKinder.innerHTML = this.value;
};

// Industry Slider
var sliderIndustry = document.getElementById("industryDistance");
var outputIndustry = document.getElementById("outIndustry");
outputIndustry.innerHTML = sliderIndustry.value;

// Update slider value
sliderIndustry.oninput = function() {
  outputIndustry.innerHTML = this.value;
};

// House Price Slider
var sliderHprice = document.getElementById("hpriceDistance");
var outputHprice = document.getElementById("outHprice");
outputHprice.innerHTML = sliderHprice.value;

// Update slider value
sliderHprice.oninput = function() {
  outputHprice.innerHTML = this.value;
};

info_element.innerHTML = '<br><br><br><br>Search<br>&<br>Select a Cell';

/*

STLYE GRIDS BASED ON USER INPUT

*/

// Commit Search Button Feature
function commitSearchFunction() {

  // Calculate Weights for 1km Grid - Hovestadden
  var source_1km_hovestad = grid1km_vectorimage_hovestad.getSource();
  var features_1km_hovestad = source_1km_hovestad.getFeatures();

  features_1km_hovestad.forEach(function(feature){
    // MATCH PERCENTAGE FOR UNIVERSITIES
    var uni_matched;
    if ((feature.get("_univers_2")/1000) > parseInt(sliderUni.value)) {
      uni_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_univers_2")/1000 == parseInt(sliderUni.value)) || (parseInt(sliderUni.value) > (feature.get("_univers_2")/1000)))){
        uni_matched = 1; //Within the cell interval
      }  

    var school_matched;
    // MATCH PERCENTAGE FOR SCHOOLS
    if ((feature.get("_schoolsma")/1000) > parseInt(sliderSchools.value)) {
      school_matched = 0; //Out of the cell interval
    }
      else if(((feature.get("_schoolsma")/1000 == parseInt(sliderSchools.value)) || (parseInt(sliderSchools.value) > (feature.get("_schoolsma")/1000)))){
        school_matched = 1; //Within the cell interval
      }  

    // MATCH PERCENTAGE FOR HOUSE PRICES
    var house_matched;
    if ((feature.get("housepri_2")) > parseInt(sliderHprice.value)) {
      house_matched = 0; //Out of the cell interval
    }
      else if (((feature.get("housepri_2") == parseInt(sliderHprice.value)) || (parseInt(sliderHprice.value) > (feature.get("housepri_2"))))){
        house_matched = 1; //Within the cell interval
      }
    
    // MATCH PERCENTAGE FOR KINDERGARTENS
    var kinder_matched;
    if ((feature.get("_kindermax")/1000) > parseInt(sliderKinder.value)) {
      kinder_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_kindermax")/1000 == parseInt(sliderKinder.value)) || (parseInt(sliderKinder.value) > (feature.get("_kindermax")/1000)))){
        kinder_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR HOSPITALS
    var hospital_matched;
    if ((feature.get("_hospita_2")/1000) > parseInt(sliderHospitals.value)) {
      hospital_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_hospita_2")/1000 == parseInt(sliderHospitals.value)) || (parseInt(sliderHospitals.value) > (feature.get("_hospita_2")/1000)))){
        hospital_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PARKS
    var park_matched;
    if ((feature.get("_leisure_2")/1000) > parseInt(sliderParks.value)) {
      park_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_leisure_2")/1000 == parseInt(sliderParks.value)) || (parseInt(sliderParks.value) > (feature.get("_leisure_2")/1000)))){
        park_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR ROADS
    var roads_matched;
    if ((feature.get("_roadsmax")/1000) > parseInt(sliderRoads.value)) {
      roads_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_roadsmax")/1000 == parseInt(sliderRoads.value)) || (parseInt(sliderRoads.value) > (feature.get("_roadsmax")/1000)))){
        roads_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR SUPERMARKETS
    var markets_matched;
    if ((feature.get("_superma_2")/1000) > parseInt(sliderMarkets.value)) {
      markets_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_superma_2")/1000 == parseInt(sliderMarkets.value)) || (parseInt(sliderMarkets.value) > (feature.get("_superma_2")/1000)))){
        markets_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PT STOPS
    var ptstops_matched;
    if ((feature.get("_pt_stop_2")/1000) > parseInt(sliderPstops.value)) {
      ptstops_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_pt_stop_2")/1000 == parseInt(sliderPstops.value)) || (parseInt(sliderPstops.value) > (feature.get("_pt_stop_2")/1000)))){
        ptstops_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PT STATIONS
    var ptstations_matched;
    if ((feature.get("_pt_stat_2")/1000) > parseInt(sliderPstations.value)) {
      ptstations_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_pt_stat_2")/1000 == parseInt(sliderPstations.value)) || (parseInt(sliderPstations.value) > (feature.get("_pt_stat_2")/1000)))){
        ptstations_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR RESTUARANTS
    var restuarants_matched;
    if ((feature.get("_restaur_2")/1000) > parseInt(sliderRestuarants.value)) {
      restuarants_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_restaur_2")/1000 == parseInt(sliderRestuarants.value)) || (parseInt(sliderRestuarants.value) > (feature.get("_restaur_2")/1000)))){
        restuarants_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR THEATRES
    var theatres_matched;
    if ((feature.get("_theatre_2")/1000) > parseInt(sliderTheatres.value)) {
      theatres_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_theatre_2")/1000 == parseInt(sliderTheatres.value)) || (parseInt(sliderTheatres.value) > (feature.get("_theatre_2")/1000)))){
        theatres_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR CINEMAS
    var cinemas_matched;
    if ((feature.get("_cinemasma")/1000) > parseInt(sliderCinemas.value)) {
      cinemas_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_cinemasma")/1000 == parseInt(sliderCinemas.value)) || (parseInt(sliderCinemas.value) > (feature.get("_cinemasma")/1000)))){
        cinemas_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR INDUSTRIES
    var industries_matched;
    if ((feature.get("_industr_2")/1000) > parseInt(sliderIndustry.value)) {
      industries_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_industr_2")/1000 == parseInt(sliderIndustry.value)) || (parseInt(sliderIndustry.value) > (feature.get("_industr_2")/1000)))){
        industries_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR WATER BODIES
    var wbodies_matched;
    if ((feature.get("_waterbo_2")/1000) > parseInt(sliderWater.value)) {
      wbodies_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_waterbo_2")/1000 == parseInt(sliderWater.value)) || (parseInt(sliderWater.value) > (feature.get("_waterbo_2")/1000)))){
        wbodies_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR COASTS
    var coasts_matched;
    if ((feature.get("_coastli_2")/1000) > parseInt(sliderCoasts.value)) {
      coasts_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_coastli_2")/1000 == parseInt(sliderCoasts.value)) || (parseInt(sliderCoasts.value) > (feature.get("_coastli_2")/1000)))){
        coasts_matched = 1; //Within the cell interval
      }
      
    // OVERALL PERCENTAGE CELL MATCH
    var new_fuzzy_value = ((uni_matched + school_matched + house_matched + kinder_matched + hospital_matched + park_matched + roads_matched + markets_matched + ptstops_matched + ptstations_matched + restuarants_matched + theatres_matched + cinemas_matched + industries_matched + wbodies_matched + coasts_matched)/16);
    feature.set("fuzzyvalue", new_fuzzy_value);
    //console.log("1km Fuzzy: " + new_fuzzy_value);
    var accessibility = (((roads_matched + ptstops_matched + ptstations_matched) / 3) * 100);
    var livability = (((uni_matched + school_matched + kinder_matched + coasts_matched + markets_matched + wbodies_matched + industries_matched + hospital_matched + restuarants_matched + theatres_matched + cinemas_matched + park_matched) / 12) * 100);
    var suitability = (((house_matched) / 1) * 100);
    feature.set("accessibility", accessibility);
    feature.set("livability", livability);
    feature.set("suitability", suitability);
  });

  // Calculate Weights for 1km Grid - Sjælland
  var source_1km_sjælland = grid1km_vectorimage_sjælland.getSource();
  var features_1km_sjælland = source_1km_sjælland.getFeatures();

  features_1km_sjælland.forEach(function(feature){
    // MATCH PERCENTAGE FOR UNIVERSITIES
    var uni_matched;
    if ((feature.get("_univers_2")/1000) > parseInt(sliderUni.value)) {
      uni_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_univers_2")/1000 == parseInt(sliderUni.value)) || (parseInt(sliderUni.value) > (feature.get("_univers_2")/1000)))){
        uni_matched = 1; //Within the cell interval
      }  

    var school_matched;
    // MATCH PERCENTAGE FOR SCHOOLS
    if ((feature.get("_schoolsma")/1000) > parseInt(sliderSchools.value)) {
      school_matched = 0; //Out of the cell interval
    }
      else if(((feature.get("_schoolsma")/1000 == parseInt(sliderSchools.value)) || (parseInt(sliderSchools.value) > (feature.get("_schoolsma")/1000)))){
        school_matched = 1; //Within the cell interval
      }  

    // MATCH PERCENTAGE FOR HOUSE PRICES
    var house_matched;
    if ((feature.get("housepri_2")) > parseInt(sliderHprice.value)) {
      house_matched = 0; //Out of the cell interval
    }
      else if (((feature.get("housepri_2") == parseInt(sliderHprice.value)) || (parseInt(sliderHprice.value) > (feature.get("housepri_2"))))){
        house_matched = 1; //Within the cell interval
      }
    
    // MATCH PERCENTAGE FOR KINDERGARTENS
    var kinder_matched;
    if ((feature.get("_kindermax")/1000) > parseInt(sliderKinder.value)) {
      kinder_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_kindermax")/1000 == parseInt(sliderKinder.value)) || (parseInt(sliderKinder.value) > (feature.get("_kindermax")/1000)))){
        kinder_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR HOSPITALS
    var hospital_matched;
    if ((feature.get("_hospita_2")/1000) > parseInt(sliderHospitals.value)) {
      hospital_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_hospita_2")/1000 == parseInt(sliderHospitals.value)) || (parseInt(sliderHospitals.value) > (feature.get("_hospita_2")/1000)))){
        hospital_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PARKS
    var park_matched;
    if ((feature.get("_leisure_2")/1000) > parseInt(sliderParks.value)) {
      park_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_leisure_2")/1000 == parseInt(sliderParks.value)) || (parseInt(sliderParks.value) > (feature.get("_leisure_2")/1000)))){
        park_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR ROADS
    var roads_matched;
    if ((feature.get("_roadsmax")/1000) > parseInt(sliderRoads.value)) {
      roads_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_roadsmax")/1000 == parseInt(sliderRoads.value)) || (parseInt(sliderRoads.value) > (feature.get("_roadsmax")/1000)))){
        roads_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR SUPERMARKETS
    var markets_matched;
    if ((feature.get("_superma_2")/1000) > parseInt(sliderMarkets.value)) {
      markets_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_superma_2")/1000 == parseInt(sliderMarkets.value)) || (parseInt(sliderMarkets.value) > (feature.get("_superma_2")/1000)))){
        markets_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PT STOPS
    var ptstops_matched;
    if ((feature.get("_pt_stop_2")/1000) > parseInt(sliderPstops.value)) {
      ptstops_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_pt_stop_2")/1000 == parseInt(sliderPstops.value)) || (parseInt(sliderPstops.value) > (feature.get("_pt_stop_2")/1000)))){
        ptstops_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PT STATIONS
    var ptstations_matched;
    if ((feature.get("_pt_stat_2")/1000) > parseInt(sliderPstations.value)) {
      ptstations_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_pt_stat_2")/1000 == parseInt(sliderPstations.value)) || (parseInt(sliderPstations.value) > (feature.get("_pt_stat_2")/1000)))){
        ptstations_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR RESTUARANTS
    var restuarants_matched;
    if ((feature.get("_restaur_2")/1000) > parseInt(sliderRestuarants.value)) {
      restuarants_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_restaur_2")/1000 == parseInt(sliderRestuarants.value)) || (parseInt(sliderRestuarants.value) > (feature.get("_restaur_2")/1000)))){
        restuarants_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR THEATRES
    var theatres_matched;
    if ((feature.get("_theatre_2")/1000) > parseInt(sliderTheatres.value)) {
      theatres_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_theatre_2")/1000 == parseInt(sliderTheatres.value)) || (parseInt(sliderTheatres.value) > (feature.get("_theatre_2")/1000)))){
        theatres_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR CINEMAS
    var cinemas_matched;
    if ((feature.get("_cinemasma")/1000) > parseInt(sliderCinemas.value)) {
      cinemas_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_cinemasma")/1000 == parseInt(sliderCinemas.value)) || (parseInt(sliderCinemas.value) > (feature.get("_cinemasma")/1000)))){
        cinemas_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR INDUSTRIES
    var industries_matched;
    if ((feature.get("_industr_2")/1000) > parseInt(sliderIndustry.value)) {
      industries_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_industr_2")/1000 == parseInt(sliderIndustry.value)) || (parseInt(sliderIndustry.value) > (feature.get("_industr_2")/1000)))){
        industries_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR WATER BODIES
    var wbodies_matched;
    if ((feature.get("_waterbo_2")/1000) > parseInt(sliderWater.value)) {
      wbodies_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_waterbo_2")/1000 == parseInt(sliderWater.value)) || (parseInt(sliderWater.value) > (feature.get("_waterbo_2")/1000)))){
        wbodies_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR COASTS
    var coasts_matched;
    if ((feature.get("_coastli_2")/1000) > parseInt(sliderCoasts.value)) {
      coasts_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_coastli_2")/1000 == parseInt(sliderCoasts.value)) || (parseInt(sliderCoasts.value) > (feature.get("_coastli_2")/1000)))){
        coasts_matched = 1; //Within the cell interval
      }
      
    // OVERALL PERCENTAGE CELL MATCH
    var new_fuzzy_value = ((uni_matched + school_matched + house_matched + kinder_matched + hospital_matched + park_matched + roads_matched + markets_matched + ptstops_matched + ptstations_matched + restuarants_matched + theatres_matched + cinemas_matched + industries_matched + wbodies_matched + coasts_matched)/16);
    feature.set("fuzzyvalue", new_fuzzy_value);
    //console.log("1km Fuzzy: " + new_fuzzy_value);
    var accessibility = (((roads_matched + ptstops_matched + ptstations_matched) / 3) * 100);
    var livability = (((uni_matched + school_matched + kinder_matched + coasts_matched + markets_matched + wbodies_matched + industries_matched + hospital_matched + restuarants_matched + theatres_matched + cinemas_matched + park_matched) / 12) * 100);
    var suitability = (((house_matched) / 1) * 100);
    feature.set("accessibility", accessibility);
    feature.set("livability", livability);
    feature.set("suitability", suitability);
  });

  // Calculate Weights for 1km Grid - Fyn
  var source_1km_fyn = grid1km_vectorimage_fyn.getSource();
  var features_1km_fyn = source_1km_fyn.getFeatures();

  features_1km_fyn.forEach(function(feature){
    // MATCH PERCENTAGE FOR UNIVERSITIES
    var uni_matched;
    if ((feature.get("_univers_2")/1000) > parseInt(sliderUni.value)) {
      uni_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_univers_2")/1000 == parseInt(sliderUni.value)) || (parseInt(sliderUni.value) > (feature.get("_univers_2")/1000)))){
        uni_matched = 1; //Within the cell interval
      }  

    var school_matched;
    // MATCH PERCENTAGE FOR SCHOOLS
    if ((feature.get("_schoolsma")/1000) > parseInt(sliderSchools.value)) {
      school_matched = 0; //Out of the cell interval
    }
      else if(((feature.get("_schoolsma")/1000 == parseInt(sliderSchools.value)) || (parseInt(sliderSchools.value) > (feature.get("_schoolsma")/1000)))){
        school_matched = 1; //Within the cell interval
      }  

    // MATCH PERCENTAGE FOR HOUSE PRICES
    var house_matched;
    if ((feature.get("housepri_2")) > parseInt(sliderHprice.value)) {
      house_matched = 0; //Out of the cell interval
    }
      else if (((feature.get("housepri_2") == parseInt(sliderHprice.value)) || (parseInt(sliderHprice.value) > (feature.get("housepri_2"))))){
        house_matched = 1; //Within the cell interval
      }
    
    // MATCH PERCENTAGE FOR KINDERGARTENS
    var kinder_matched;
    if ((feature.get("_kindermax")/1000) > parseInt(sliderKinder.value)) {
      kinder_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_kindermax")/1000 == parseInt(sliderKinder.value)) || (parseInt(sliderKinder.value) > (feature.get("_kindermax")/1000)))){
        kinder_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR HOSPITALS
    var hospital_matched;
    if ((feature.get("_hospita_2")/1000) > parseInt(sliderHospitals.value)) {
      hospital_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_hospita_2")/1000 == parseInt(sliderHospitals.value)) || (parseInt(sliderHospitals.value) > (feature.get("_hospita_2")/1000)))){
        hospital_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PARKS
    var park_matched;
    if ((feature.get("_leisure_2")/1000) > parseInt(sliderParks.value)) {
      park_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_leisure_2")/1000 == parseInt(sliderParks.value)) || (parseInt(sliderParks.value) > (feature.get("_leisure_2")/1000)))){
        park_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR ROADS
    var roads_matched;
    if ((feature.get("_roadsmax")/1000) > parseInt(sliderRoads.value)) {
      roads_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_roadsmax")/1000 == parseInt(sliderRoads.value)) || (parseInt(sliderRoads.value) > (feature.get("_roadsmax")/1000)))){
        roads_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR SUPERMARKETS
    var markets_matched;
    if ((feature.get("_superma_2")/1000) > parseInt(sliderMarkets.value)) {
      markets_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_superma_2")/1000 == parseInt(sliderMarkets.value)) || (parseInt(sliderMarkets.value) > (feature.get("_superma_2")/1000)))){
        markets_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PT STOPS
    var ptstops_matched;
    if ((feature.get("_pt_stop_2")/1000) > parseInt(sliderPstops.value)) {
      ptstops_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_pt_stop_2")/1000 == parseInt(sliderPstops.value)) || (parseInt(sliderPstops.value) > (feature.get("_pt_stop_2")/1000)))){
        ptstops_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PT STATIONS
    var ptstations_matched;
    if ((feature.get("_pt_stat_2")/1000) > parseInt(sliderPstations.value)) {
      ptstations_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_pt_stat_2")/1000 == parseInt(sliderPstations.value)) || (parseInt(sliderPstations.value) > (feature.get("_pt_stat_2")/1000)))){
        ptstations_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR RESTUARANTS
    var restuarants_matched;
    if ((feature.get("_restaur_2")/1000) > parseInt(sliderRestuarants.value)) {
      restuarants_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_restaur_2")/1000 == parseInt(sliderRestuarants.value)) || (parseInt(sliderRestuarants.value) > (feature.get("_restaur_2")/1000)))){
        restuarants_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR THEATRES
    var theatres_matched;
    if ((feature.get("_theatre_2")/1000) > parseInt(sliderTheatres.value)) {
      theatres_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_theatre_2")/1000 == parseInt(sliderTheatres.value)) || (parseInt(sliderTheatres.value) > (feature.get("_theatre_2")/1000)))){
        theatres_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR CINEMAS
    var cinemas_matched;
    if ((feature.get("_cinemasma")/1000) > parseInt(sliderCinemas.value)) {
      cinemas_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_cinemasma")/1000 == parseInt(sliderCinemas.value)) || (parseInt(sliderCinemas.value) > (feature.get("_cinemasma")/1000)))){
        cinemas_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR INDUSTRIES
    var industries_matched;
    if ((feature.get("_industr_2")/1000) > parseInt(sliderIndustry.value)) {
      industries_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_industr_2")/1000 == parseInt(sliderIndustry.value)) || (parseInt(sliderIndustry.value) > (feature.get("_industr_2")/1000)))){
        industries_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR WATER BODIES
    var wbodies_matched;
    if ((feature.get("_waterbo_2")/1000) > parseInt(sliderWater.value)) {
      wbodies_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_waterbo_2")/1000 == parseInt(sliderWater.value)) || (parseInt(sliderWater.value) > (feature.get("_waterbo_2")/1000)))){
        wbodies_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR COASTS
    var coasts_matched;
    if ((feature.get("_coastli_2")/1000) > parseInt(sliderCoasts.value)) {
      coasts_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_coastli_2")/1000 == parseInt(sliderCoasts.value)) || (parseInt(sliderCoasts.value) > (feature.get("_coastli_2")/1000)))){
        coasts_matched = 1; //Within the cell interval
      }
      
    // OVERALL PERCENTAGE CELL MATCH
    var new_fuzzy_value = ((uni_matched + school_matched + house_matched + kinder_matched + hospital_matched + park_matched + roads_matched + markets_matched + ptstops_matched + ptstations_matched + restuarants_matched + theatres_matched + cinemas_matched + industries_matched + wbodies_matched + coasts_matched)/16);
    feature.set("fuzzyvalue", new_fuzzy_value);
    //console.log("1km Fuzzy: " + new_fuzzy_value);
    var accessibility = (((roads_matched + ptstops_matched + ptstations_matched) / 3) * 100);
    var livability = (((uni_matched + school_matched + kinder_matched + coasts_matched + markets_matched + wbodies_matched + industries_matched + hospital_matched + restuarants_matched + theatres_matched + cinemas_matched + park_matched) / 12) * 100);
    var suitability = (((house_matched) / 1) * 100);
    feature.set("accessibility", accessibility);
    feature.set("livability", livability);
    feature.set("suitability", suitability);
  });

  // Calculate Weights for 1km Grid - Midtjylland
  var source_1km_midtjylland = grid1km_vectorimage_midtjylland.getSource();
  var features_1km_midtjylland = source_1km_midtjylland.getFeatures();

  features_1km_midtjylland.forEach(function(feature){
    // MATCH PERCENTAGE FOR UNIVERSITIES
    var uni_matched;
    if ((feature.get("_univers_2")/1000) > parseInt(sliderUni.value)) {
      uni_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_univers_2")/1000 == parseInt(sliderUni.value)) || (parseInt(sliderUni.value) > (feature.get("_univers_2")/1000)))){
        uni_matched = 1; //Within the cell interval
      }  

    var school_matched;
    // MATCH PERCENTAGE FOR SCHOOLS
    if ((feature.get("_schoolsma")/1000) > parseInt(sliderSchools.value)) {
      school_matched = 0; //Out of the cell interval
    }
      else if(((feature.get("_schoolsma")/1000 == parseInt(sliderSchools.value)) || (parseInt(sliderSchools.value) > (feature.get("_schoolsma")/1000)))){
        school_matched = 1; //Within the cell interval
      }  

    // MATCH PERCENTAGE FOR HOUSE PRICES
    var house_matched;
    if ((feature.get("housepri_2")) > parseInt(sliderHprice.value)) {
      house_matched = 0; //Out of the cell interval
    }
      else if (((feature.get("housepri_2") == parseInt(sliderHprice.value)) || (parseInt(sliderHprice.value) > (feature.get("housepri_2"))))){
        house_matched = 1; //Within the cell interval
      }
    
    // MATCH PERCENTAGE FOR KINDERGARTENS
    var kinder_matched;
    if ((feature.get("_kindermax")/1000) > parseInt(sliderKinder.value)) {
      kinder_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_kindermax")/1000 == parseInt(sliderKinder.value)) || (parseInt(sliderKinder.value) > (feature.get("_kindermax")/1000)))){
        kinder_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR HOSPITALS
    var hospital_matched;
    if ((feature.get("_hospita_2")/1000) > parseInt(sliderHospitals.value)) {
      hospital_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_hospita_2")/1000 == parseInt(sliderHospitals.value)) || (parseInt(sliderHospitals.value) > (feature.get("_hospita_2")/1000)))){
        hospital_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PARKS
    var park_matched;
    if ((feature.get("_leisure_2")/1000) > parseInt(sliderParks.value)) {
      park_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_leisure_2")/1000 == parseInt(sliderParks.value)) || (parseInt(sliderParks.value) > (feature.get("_leisure_2")/1000)))){
        park_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR ROADS
    var roads_matched;
    if ((feature.get("_roadsmax")/1000) > parseInt(sliderRoads.value)) {
      roads_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_roadsmax")/1000 == parseInt(sliderRoads.value)) || (parseInt(sliderRoads.value) > (feature.get("_roadsmax")/1000)))){
        roads_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR SUPERMARKETS
    var markets_matched;
    if ((feature.get("_superma_2")/1000) > parseInt(sliderMarkets.value)) {
      markets_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_superma_2")/1000 == parseInt(sliderMarkets.value)) || (parseInt(sliderMarkets.value) > (feature.get("_superma_2")/1000)))){
        markets_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PT STOPS
    var ptstops_matched;
    if ((feature.get("_pt_stop_2")/1000) > parseInt(sliderPstops.value)) {
      ptstops_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_pt_stop_2")/1000 == parseInt(sliderPstops.value)) || (parseInt(sliderPstops.value) > (feature.get("_pt_stop_2")/1000)))){
        ptstops_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PT STATIONS
    var ptstations_matched;
    if ((feature.get("_pt_stat_2")/1000) > parseInt(sliderPstations.value)) {
      ptstations_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_pt_stat_2")/1000 == parseInt(sliderPstations.value)) || (parseInt(sliderPstations.value) > (feature.get("_pt_stat_2")/1000)))){
        ptstations_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR RESTUARANTS
    var restuarants_matched;
    if ((feature.get("_restaur_2")/1000) > parseInt(sliderRestuarants.value)) {
      restuarants_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_restaur_2")/1000 == parseInt(sliderRestuarants.value)) || (parseInt(sliderRestuarants.value) > (feature.get("_restaur_2")/1000)))){
        restuarants_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR THEATRES
    var theatres_matched;
    if ((feature.get("_theatre_2")/1000) > parseInt(sliderTheatres.value)) {
      theatres_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_theatre_2")/1000 == parseInt(sliderTheatres.value)) || (parseInt(sliderTheatres.value) > (feature.get("_theatre_2")/1000)))){
        theatres_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR CINEMAS
    var cinemas_matched;
    if ((feature.get("_cinemasma")/1000) > parseInt(sliderCinemas.value)) {
      cinemas_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_cinemasma")/1000 == parseInt(sliderCinemas.value)) || (parseInt(sliderCinemas.value) > (feature.get("_cinemasma")/1000)))){
        cinemas_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR INDUSTRIES
    var industries_matched;
    if ((feature.get("_industr_2")/1000) > parseInt(sliderIndustry.value)) {
      industries_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_industr_2")/1000 == parseInt(sliderIndustry.value)) || (parseInt(sliderIndustry.value) > (feature.get("_industr_2")/1000)))){
        industries_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR WATER BODIES
    var wbodies_matched;
    if ((feature.get("_waterbo_2")/1000) > parseInt(sliderWater.value)) {
      wbodies_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_waterbo_2")/1000 == parseInt(sliderWater.value)) || (parseInt(sliderWater.value) > (feature.get("_waterbo_2")/1000)))){
        wbodies_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR COASTS
    var coasts_matched;
    if ((feature.get("_coastli_2")/1000) > parseInt(sliderCoasts.value)) {
      coasts_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_coastli_2")/1000 == parseInt(sliderCoasts.value)) || (parseInt(sliderCoasts.value) > (feature.get("_coastli_2")/1000)))){
        coasts_matched = 1; //Within the cell interval
      }
      
    // OVERALL PERCENTAGE CELL MATCH
    var new_fuzzy_value = ((uni_matched + school_matched + house_matched + kinder_matched + hospital_matched + park_matched + roads_matched + markets_matched + ptstops_matched + ptstations_matched + restuarants_matched + theatres_matched + cinemas_matched + industries_matched + wbodies_matched + coasts_matched)/16);
    feature.set("fuzzyvalue", new_fuzzy_value);
    //console.log("1km Fuzzy: " + new_fuzzy_value);
    var accessibility = (((roads_matched + ptstops_matched + ptstations_matched) / 3) * 100);
    var livability = (((uni_matched + school_matched + kinder_matched + coasts_matched + markets_matched + wbodies_matched + industries_matched + hospital_matched + restuarants_matched + theatres_matched + cinemas_matched + park_matched) / 12) * 100);
    var suitability = (((house_matched) / 1) * 100);
    feature.set("accessibility", accessibility);
    feature.set("livability", livability);
    feature.set("suitability", suitability);
  });

  // Calculate Weights for 1km Grid - Midtjylland West
  var source_1km_midtjyllandw = grid1km_vectorimage_midtjyllandw.getSource();
  var features_1km_midtjyllandw = source_1km_midtjyllandw.getFeatures();

  features_1km_midtjyllandw.forEach(function(feature){
    // MATCH PERCENTAGE FOR UNIVERSITIES
    var uni_matched;
    if ((feature.get("_univers_2")/1000) > parseInt(sliderUni.value)) {
      uni_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_univers_2")/1000 == parseInt(sliderUni.value)) || (parseInt(sliderUni.value) > (feature.get("_univers_2")/1000)))){
        uni_matched = 1; //Within the cell interval
      }  

    var school_matched;
    // MATCH PERCENTAGE FOR SCHOOLS
    if ((feature.get("_schoolsma")/1000) > parseInt(sliderSchools.value)) {
      school_matched = 0; //Out of the cell interval
    }
      else if(((feature.get("_schoolsma")/1000 == parseInt(sliderSchools.value)) || (parseInt(sliderSchools.value) > (feature.get("_schoolsma")/1000)))){
        school_matched = 1; //Within the cell interval
      }  

    // MATCH PERCENTAGE FOR HOUSE PRICES
    var house_matched;
    if ((feature.get("housepri_2")) > parseInt(sliderHprice.value)) {
      house_matched = 0; //Out of the cell interval
    }
      else if (((feature.get("housepri_2") == parseInt(sliderHprice.value)) || (parseInt(sliderHprice.value) > (feature.get("housepri_2"))))){
        house_matched = 1; //Within the cell interval
      }
    
    // MATCH PERCENTAGE FOR KINDERGARTENS
    var kinder_matched;
    if ((feature.get("_kindermax")/1000) > parseInt(sliderKinder.value)) {
      kinder_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_kindermax")/1000 == parseInt(sliderKinder.value)) || (parseInt(sliderKinder.value) > (feature.get("_kindermax")/1000)))){
        kinder_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR HOSPITALS
    var hospital_matched;
    if ((feature.get("_hospita_2")/1000) > parseInt(sliderHospitals.value)) {
      hospital_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_hospita_2")/1000 == parseInt(sliderHospitals.value)) || (parseInt(sliderHospitals.value) > (feature.get("_hospita_2")/1000)))){
        hospital_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PARKS
    var park_matched;
    if ((feature.get("_leisure_2")/1000) > parseInt(sliderParks.value)) {
      park_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_leisure_2")/1000 == parseInt(sliderParks.value)) || (parseInt(sliderParks.value) > (feature.get("_leisure_2")/1000)))){
        park_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR ROADS
    var roads_matched;
    if ((feature.get("_roadsmax")/1000) > parseInt(sliderRoads.value)) {
      roads_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_roadsmax")/1000 == parseInt(sliderRoads.value)) || (parseInt(sliderRoads.value) > (feature.get("_roadsmax")/1000)))){
        roads_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR SUPERMARKETS
    var markets_matched;
    if ((feature.get("_superma_2")/1000) > parseInt(sliderMarkets.value)) {
      markets_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_superma_2")/1000 == parseInt(sliderMarkets.value)) || (parseInt(sliderMarkets.value) > (feature.get("_superma_2")/1000)))){
        markets_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PT STOPS
    var ptstops_matched;
    if ((feature.get("_pt_stop_2")/1000) > parseInt(sliderPstops.value)) {
      ptstops_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_pt_stop_2")/1000 == parseInt(sliderPstops.value)) || (parseInt(sliderPstops.value) > (feature.get("_pt_stop_2")/1000)))){
        ptstops_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PT STATIONS
    var ptstations_matched;
    if ((feature.get("_pt_stat_2")/1000) > parseInt(sliderPstations.value)) {
      ptstations_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_pt_stat_2")/1000 == parseInt(sliderPstations.value)) || (parseInt(sliderPstations.value) > (feature.get("_pt_stat_2")/1000)))){
        ptstations_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR RESTUARANTS
    var restuarants_matched;
    if ((feature.get("_restaur_2")/1000) > parseInt(sliderRestuarants.value)) {
      restuarants_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_restaur_2")/1000 == parseInt(sliderRestuarants.value)) || (parseInt(sliderRestuarants.value) > (feature.get("_restaur_2")/1000)))){
        restuarants_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR THEATRES
    var theatres_matched;
    if ((feature.get("_theatre_2")/1000) > parseInt(sliderTheatres.value)) {
      theatres_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_theatre_2")/1000 == parseInt(sliderTheatres.value)) || (parseInt(sliderTheatres.value) > (feature.get("_theatre_2")/1000)))){
        theatres_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR CINEMAS
    var cinemas_matched;
    if ((feature.get("_cinemasma")/1000) > parseInt(sliderCinemas.value)) {
      cinemas_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_cinemasma")/1000 == parseInt(sliderCinemas.value)) || (parseInt(sliderCinemas.value) > (feature.get("_cinemasma")/1000)))){
        cinemas_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR INDUSTRIES
    var industries_matched;
    if ((feature.get("_industr_2")/1000) > parseInt(sliderIndustry.value)) {
      industries_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_industr_2")/1000 == parseInt(sliderIndustry.value)) || (parseInt(sliderIndustry.value) > (feature.get("_industr_2")/1000)))){
        industries_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR WATER BODIES
    var wbodies_matched;
    if ((feature.get("_waterbo_2")/1000) > parseInt(sliderWater.value)) {
      wbodies_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_waterbo_2")/1000 == parseInt(sliderWater.value)) || (parseInt(sliderWater.value) > (feature.get("_waterbo_2")/1000)))){
        wbodies_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR COASTS
    var coasts_matched;
    if ((feature.get("_coastli_2")/1000) > parseInt(sliderCoasts.value)) {
      coasts_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_coastli_2")/1000 == parseInt(sliderCoasts.value)) || (parseInt(sliderCoasts.value) > (feature.get("_coastli_2")/1000)))){
        coasts_matched = 1; //Within the cell interval
      }
      
    // OVERALL PERCENTAGE CELL MATCH
    var new_fuzzy_value = ((uni_matched + school_matched + house_matched + kinder_matched + hospital_matched + park_matched + roads_matched + markets_matched + ptstops_matched + ptstations_matched + restuarants_matched + theatres_matched + cinemas_matched + industries_matched + wbodies_matched + coasts_matched)/16);
    feature.set("fuzzyvalue", new_fuzzy_value);
    //console.log("1km Fuzzy: " + new_fuzzy_value);
    var accessibility = (((roads_matched + ptstops_matched + ptstations_matched) / 3) * 100);
    var livability = (((uni_matched + school_matched + kinder_matched + coasts_matched + markets_matched + wbodies_matched + industries_matched + hospital_matched + restuarants_matched + theatres_matched + cinemas_matched + park_matched) / 12) * 100);
    var suitability = (((house_matched) / 1) * 100);
    feature.set("accessibility", accessibility);
    feature.set("livability", livability);
    feature.set("suitability", suitability);
  });

  // Calculate Weights for 100km Grid
  var source_100km = grid100km.getSource();
  var features_100km = source_100km.getFeatures();

  features_100km.forEach(function(feature){
    // MATCH PERCENTAGE FOR UNIVERSITIES
    var uni_matched;
    if ((feature.get("_univers_2")/1000) > parseInt(sliderUni.value)) {
      uni_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_univers_2")/1000 == parseInt(sliderUni.value)) || (parseInt(sliderUni.value) > (feature.get("_univers_2")/1000)))){
        uni_matched = 1; //Within the cell interval
      }  

    var school_matched;
    // MATCH PERCENTAGE FOR SCHOOLS
    if ((feature.get("_schoolsma")/1000) > parseInt(sliderSchools.value)) {
      school_matched = 0; //Out of the cell interval
    }
      else if(((feature.get("_schoolsma")/1000 == parseInt(sliderSchools.value)) || (parseInt(sliderSchools.value) > (feature.get("_schoolsma")/1000)))){
        school_matched = 1; //Within the cell interval
      }  

    // MATCH PERCENTAGE FOR HOUSE PRICES
    var house_matched;
    if ((feature.get("housepri_2")) > parseInt(sliderHprice.value)) {
      house_matched = 0; //Out of the cell interval
    }
      else if (((feature.get("housepri_2") == parseInt(sliderHprice.value)) || (parseInt(sliderHprice.value) > (feature.get("housepri_2"))))){
        house_matched = 1; //Within the cell interval
      }
    
    // MATCH PERCENTAGE FOR KINDERGARTENS
    var kinder_matched;
    if ((feature.get("_kindermax")/1000) > parseInt(sliderKinder.value)) {
      kinder_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_kindermax")/1000 == parseInt(sliderKinder.value)) || (parseInt(sliderKinder.value) > (feature.get("_kindermax")/1000)))){
        kinder_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR HOSPITALS
    var hospital_matched;
    if ((feature.get("_hospita_2")/1000) > parseInt(sliderHospitals.value)) {
      hospital_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_hospita_2")/1000 == parseInt(sliderHospitals.value)) || (parseInt(sliderHospitals.value) > (feature.get("_hospita_2")/1000)))){
        hospital_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PARKS
    var park_matched;
    if ((feature.get("_leisure_2")/1000) > parseInt(sliderParks.value)) {
      park_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_leisure_2")/1000 == parseInt(sliderParks.value)) || (parseInt(sliderParks.value) > (feature.get("_leisure_2")/1000)))){
        park_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR ROADS
    var roads_matched;
    if ((feature.get("_roadsmax")/1000) > parseInt(sliderRoads.value)) {
      roads_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_roadsmax")/1000 == parseInt(sliderRoads.value)) || (parseInt(sliderRoads.value) > (feature.get("_roadsmax")/1000)))){
        roads_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR SUPERMARKETS
    var markets_matched;
    if ((feature.get("_superma_2")/1000) > parseInt(sliderMarkets.value)) {
      markets_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_superma_2")/1000 == parseInt(sliderMarkets.value)) || (parseInt(sliderMarkets.value) > (feature.get("_superma_2")/1000)))){
        markets_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PT STOPS
    var ptstops_matched;
    if ((feature.get("_pt_stop_2")/1000) > parseInt(sliderPstops.value)) {
      ptstops_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_pt_stop_2")/1000 == parseInt(sliderPstops.value)) || (parseInt(sliderPstops.value) > (feature.get("_pt_stop_2")/1000)))){
        ptstops_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PT STATIONS
    var ptstations_matched;
    if ((feature.get("_pt_stat_2")/1000) > parseInt(sliderPstations.value)) {
      ptstations_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_pt_stat_2")/1000 == parseInt(sliderPstations.value)) || (parseInt(sliderPstations.value) > (feature.get("_pt_stat_2")/1000)))){
        ptstations_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR RESTUARANTS
    var restuarants_matched;
    if ((feature.get("_restaur_2")/1000) > parseInt(sliderRestuarants.value)) {
      restuarants_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_restaur_2")/1000 == parseInt(sliderRestuarants.value)) || (parseInt(sliderRestuarants.value) > (feature.get("_restaur_2")/1000)))){
        restuarants_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR THEATRES
    var theatres_matched;
    if ((feature.get("_theatre_2")/1000) > parseInt(sliderTheatres.value)) {
      theatres_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_theatre_2")/1000 == parseInt(sliderTheatres.value)) || (parseInt(sliderTheatres.value) > (feature.get("_theatre_2")/1000)))){
        theatres_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR CINEMAS
    var cinemas_matched;
    if ((feature.get("_cinemasma")/1000) > parseInt(sliderCinemas.value)) {
      cinemas_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_cinemasma")/1000 == parseInt(sliderCinemas.value)) || (parseInt(sliderCinemas.value) > (feature.get("_cinemasma")/1000)))){
        cinemas_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR INDUSTRIES
    var industries_matched;
    if ((feature.get("_industr_2")/1000) > parseInt(sliderIndustry.value)) {
      industries_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_industr_2")/1000 == parseInt(sliderIndustry.value)) || (parseInt(sliderIndustry.value) > (feature.get("_industr_2")/1000)))){
        industries_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR WATER BODIES
    var wbodies_matched;
    if ((feature.get("_waterbo_2")/1000) > parseInt(sliderWater.value)) {
      wbodies_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_waterbo_2")/1000 == parseInt(sliderWater.value)) || (parseInt(sliderWater.value) > (feature.get("_waterbo_2")/1000)))){
        wbodies_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR COASTS
    var coasts_matched;
    if ((feature.get("_coastli_2")/1000) > parseInt(sliderCoasts.value)) {
      coasts_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_coastli_2")/1000 == parseInt(sliderCoasts.value)) || (parseInt(sliderCoasts.value) > (feature.get("_coastli_2")/1000)))){
        coasts_matched = 1; //Within the cell interval
      }
      
    // OVERALL PERCENTAGE CELL MATCH
    var new_fuzzy_value_100 = ((uni_matched + school_matched + house_matched + kinder_matched + hospital_matched + park_matched + roads_matched + markets_matched + ptstops_matched + ptstations_matched + restuarants_matched + theatres_matched + cinemas_matched + industries_matched + wbodies_matched + coasts_matched)/16);
    feature.set("fuzzyvalue", new_fuzzy_value_100);
    console.log("100km Fuzzy: " + new_fuzzy_value_100);
    var accessibility = (((roads_matched + ptstops_matched + ptstations_matched) / 3) * 100);
    var livability = (((uni_matched + school_matched + kinder_matched + coasts_matched + markets_matched + wbodies_matched + industries_matched + hospital_matched + restuarants_matched + theatres_matched + cinemas_matched + park_matched) / 12) * 100);
    var suitability = (((house_matched) / 1) * 100);
    feature.set("accessibility", accessibility);
    feature.set("livability", livability);
    feature.set("suitability", suitability);
    });

  // Calculate Weights for 30km Grid
  var source_30km = grid30km.getSource();
  var features_30km = source_30km.getFeatures();

  features_30km.forEach(function(feature){
    // MATCH PERCENTAGE FOR UNIVERSITIES
    var uni_matched;
    if ((feature.get("_univers_2")/1000) > parseInt(sliderUni.value)) {
      uni_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_univers_2")/1000 == parseInt(sliderUni.value)) || (parseInt(sliderUni.value) > (feature.get("_univers_2")/1000)))){
        uni_matched = 1; //Within the cell interval
      }  

    var school_matched;
    // MATCH PERCENTAGE FOR SCHOOLS
    if ((feature.get("_schoolsma")/1000) > parseInt(sliderSchools.value)) {
      school_matched = 0; //Out of the cell interval
    }
      else if(((feature.get("_schoolsma")/1000 == parseInt(sliderSchools.value)) || (parseInt(sliderSchools.value) > (feature.get("_schoolsma")/1000)))){
        school_matched = 1; //Within the cell interval
      }  

    // MATCH PERCENTAGE FOR HOUSE PRICES
    var house_matched;
    if ((feature.get("housepri_2")) > parseInt(sliderHprice.value)) {
      house_matched = 0; //Out of the cell interval
    }
      else if (((feature.get("housepri_2") == parseInt(sliderHprice.value)) || (parseInt(sliderHprice.value) > (feature.get("housepri_2"))))){
        house_matched = 1; //Within the cell interval
      }
    
    // MATCH PERCENTAGE FOR KINDERGARTENS
    var kinder_matched;
    if ((feature.get("_kindermax")/1000) > parseInt(sliderKinder.value)) {
      kinder_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_kindermax")/1000 == parseInt(sliderKinder.value)) || (parseInt(sliderKinder.value) > (feature.get("_kindermax")/1000)))){
        kinder_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR HOSPITALS
    var hospital_matched;
    if ((feature.get("_hospita_2")/1000) > parseInt(sliderHospitals.value)) {
      hospital_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_hospita_2")/1000 == parseInt(sliderHospitals.value)) || (parseInt(sliderHospitals.value) > (feature.get("_hospita_2")/1000)))){
        hospital_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PARKS
    var park_matched;
    if ((feature.get("_leisure_2")/1000) > parseInt(sliderParks.value)) {
      park_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_leisure_2")/1000 == parseInt(sliderParks.value)) || (parseInt(sliderParks.value) > (feature.get("_leisure_2")/1000)))){
        park_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR ROADS
    var roads_matched;
    if ((feature.get("_roadsmax")/1000) > parseInt(sliderRoads.value)) {
      roads_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_roadsmax")/1000 == parseInt(sliderRoads.value)) || (parseInt(sliderRoads.value) > (feature.get("_roadsmax")/1000)))){
        roads_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR SUPERMARKETS
    var markets_matched;
    if ((feature.get("_superma_2")/1000) > parseInt(sliderMarkets.value)) {
      markets_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_superma_2")/1000 == parseInt(sliderMarkets.value)) || (parseInt(sliderMarkets.value) > (feature.get("_superma_2")/1000)))){
        markets_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PT STOPS
    var ptstops_matched;
    if ((feature.get("_pt_stop_2")/1000) > parseInt(sliderPstops.value)) {
      ptstops_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_pt_stop_2")/1000 == parseInt(sliderPstops.value)) || (parseInt(sliderPstops.value) > (feature.get("_pt_stop_2")/1000)))){
        ptstops_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR PT STATIONS
    var ptstations_matched;
    if ((feature.get("_pt_stat_2")/1000) > parseInt(sliderPstations.value)) {
      ptstations_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_pt_stat_2")/1000 == parseInt(sliderPstations.value)) || (parseInt(sliderPstations.value) > (feature.get("_pt_stat_2")/1000)))){
        ptstations_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR RESTUARANTS
    var restuarants_matched;
    if ((feature.get("_restaur_2")/1000) > parseInt(sliderRestuarants.value)) {
      restuarants_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_restaur_2")/1000 == parseInt(sliderRestuarants.value)) || (parseInt(sliderRestuarants.value) > (feature.get("_restaur_2")/1000)))){
        restuarants_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR THEATRES
    var theatres_matched;
    if ((feature.get("_theatre_2")/1000) > parseInt(sliderTheatres.value)) {
      theatres_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_theatre_2")/1000 == parseInt(sliderTheatres.value)) || (parseInt(sliderTheatres.value) > (feature.get("_theatre_2")/1000)))){
        theatres_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR CINEMAS
    var cinemas_matched;
    if ((feature.get("_cinemasma")/1000) > parseInt(sliderCinemas.value)) {
      cinemas_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_cinemasma")/1000 == parseInt(sliderCinemas.value)) || (parseInt(sliderCinemas.value) > (feature.get("_cinemasma")/1000)))){
        cinemas_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR INDUSTRIES
    var industries_matched;
    if ((feature.get("_industr_2")/1000) > parseInt(sliderIndustry.value)) {
      industries_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_industr_2")/1000 == parseInt(sliderIndustry.value)) || (parseInt(sliderIndustry.value) > (feature.get("_industr_2")/1000)))){
        industries_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR WATER BODIES
    var wbodies_matched;
    if ((feature.get("_waterbo_2")/1000) > parseInt(sliderWater.value)) {
      wbodies_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_waterbo_2")/1000 == parseInt(sliderWater.value)) || (parseInt(sliderWater.value) > (feature.get("_waterbo_2")/1000)))){
        wbodies_matched = 1; //Within the cell interval
      }

    // MATCH PERCENTAGE FOR COASTS
    var coasts_matched;
    if ((feature.get("_coastli_2")/1000) > parseInt(sliderCoasts.value)) {
      coasts_matched = 0; //Out of the cell interval
      }
      else if(((feature.get("_coastli_2")/1000 == parseInt(sliderCoasts.value)) || (parseInt(sliderCoasts.value) > (feature.get("_coastli_2")/1000)))){
        coasts_matched = 1; //Within the cell interval
      }
      
    // OVERALL PERCENTAGE CELL MATCH
    var new_fuzzy_value_30 = ((uni_matched + school_matched + house_matched + kinder_matched + hospital_matched + park_matched + roads_matched + markets_matched + ptstops_matched + ptstations_matched + restuarants_matched + theatres_matched + cinemas_matched + industries_matched + wbodies_matched + coasts_matched)/16);
    feature.set("fuzzyvalue", new_fuzzy_value_30);
    console.log("30km Fuzzy: " + new_fuzzy_value_30);
    var accessibility = (((roads_matched + ptstops_matched + ptstations_matched) / 3) * 100);
    var livability = (((uni_matched + school_matched + kinder_matched + coasts_matched + markets_matched + wbodies_matched + industries_matched + hospital_matched + restuarants_matched + theatres_matched + cinemas_matched + park_matched) / 12) * 100);
    var suitability = (((house_matched) / 1) * 100);
    feature.set("accessibility", accessibility);
    feature.set("livability", livability);
    feature.set("suitability", suitability);
  });
};

// Trigger 'Commit Search' button on click
let bttn = document.getElementById("commitButton");
bttn.addEventListener("click", commitSearchFunction, false);

map.addOverlay(overlay);

/**
 * Add a click handler to the map to render the popup.
 */
map.on('singleclick', function (evt) {
var feature = map.forEachFeatureAtPixel(evt.pixel,
  function(feature, layer) {
    // Work only if the click on the grid layer
    if (layer == grid100km, grid30km, grid1km_vectorimage_hovestad, grid1km_vectorimage_fyn, grid1km_vectorimage_midtjylland, grid1km_vectorimage_midtjyllandw, grid1km_vectorimage_sjælland) {
    return feature;
    }
  });

  // Classify Political Party
  var feature_party;
  if (feature.get('_Politicsm') == 1){
    feature_party = 'Liberal Democratic Party'
  }
  else if (feature.get('_Politicsm') == 2){
    feature_party = 'Conservative Peoples Party'
  }
  else if (feature.get('_Politicsm') == 3){
    feature_party = 'Social Democratic Party'
  }
  else if (feature.get('_Politicsm') == 4){
    feature_party = 'Socialist Peoples Party'
  }
  else if (feature.get('_Politicsm') == 5){
    feature_party = 'Unkown'
  }

  // Show the property of the feature
  var content = 'Avg Crime Rate: <b>' + feature.get('crimes_cri').toFixed(2).toString() + '</b>*<br>';
  content += 'Avg PM10 Content: <b>' + feature.get('_PM10mean').toFixed(2).toString() + '</b><br>';
  content += 'Avg PM25 Content: <b>' + feature.get('_PM25mean').toFixed(2).toString() + '</b><br>';
  content += 'Avg NO<sub>2</sub> Content: <b>' + feature.get('_NO2mean').toFixed(2).toString() + '</b><br>';
  //content += 'Avg O<sup>3</sup> Content: <b>' + feature.get('O3mean').toFixed(2).toString() + '</b><br>';
  content += 'Political Party: ' + feature_party + '<br>';
  content += '* # of crimes in Q1 2021';
  content_element.innerHTML = content;

  overlay.setPosition(evt.coordinate);

  var overall_percent = (feature.get('fuzzyvalue')*100).toFixed().toString();

  var coast_value = ((feature.get('_coastline')/1000)).toFixed(2).toString();
  var hospital_value = ((feature.get('_hospitals')/1000)).toFixed(2).toString();
  var parks_value = ((feature.get('_leisurepa')/1000)).toFixed(2).toString();
  var roads_value = ((feature.get('_roadsmean')/1000)).toFixed(2).toString();
  var schools_value = ((feature.get('_schoolsme')/1000)).toFixed(2).toString();
  var markets_value = ((feature.get('_supermark')/1000)).toFixed(2).toString();
  var uni_value = ((feature.get('_universit')/1000)).toFixed(2).toString();
  var water_value = ((feature.get('_waterbodi')/1000)).toFixed(2).toString();
  var ptstops_value = ((feature.get('_pt_stopsm')/1000)).toFixed(2).toString();
  var ptstat_value = ((feature.get('_pt_statio')/1000)).toFixed(2).toString();
  var rest_value = ((feature.get('_restauran')/1000)).toFixed(2).toString();
  var theatre_value = ((feature.get('_theatresm')/1000)).toFixed(2).toString();
  var cinema_value = ((feature.get('_cinemasme')/1000)).toFixed(2).toString();
  var kinder_value = ((feature.get('_kindermea')/1000)).toFixed(2).toString();
  var industry_value = ((feature.get('_industrie')/1000)).toFixed(2).toString();
  var avg_house_price = (feature.get('housepri_1')).toFixed(0).toString();
  var cell_id = (feature.get('id')).toFixed(0).toString();
  var accessibility_match = (feature.get('accessibility')).toFixed(0);
  var livability_match = (feature.get('livability')).toFixed(0);
  var suitability_match = (feature.get('suitability')).toFixed(0);


  // Populate Results Box with Grid Information
  info_element.innerHTML = 'Cell ' + cell_id + ':<br>' + overall_percent + '% Match<br>' + 'Average House Price: <br>' + avg_house_price + '(dkk/m2)*';

  console.info(feature.getProperties());

  // Destroy existing chart to build new
  if(window.myChart instanceof Chart)
    {
        window.myChart.destroy();
    };

  if(window.catChart instanceof Chart)
  {
      window.catChart.destroy();
  };
  
  var ctx = document.getElementById('myChart').getContext('2d');
  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Coasts', 'Hospitals', 'Parks', 'Roads', 'Schools', 'Grocery Stores', 'Universities', 'Water Bodies', 'Public Transport Stops', 'Public Transport Stations', 'Restaurants', 'Theatres', 'Cinemas', 'Kindergartens', 'Industry'],
        datasets: [{
            label: ['Distance (Km)'],
            data: [coast_value, hospital_value, parks_value, roads_value, schools_value, markets_value, uni_value, water_value, ptstops_value, ptstat_value, rest_value, theatre_value, cinema_value, kinder_value, industry_value],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(166,206,227, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(31,120,180, 0.2)',
                'rgba(178,223,138, 0.2)',
                'rgba(51,160,44, 0.2)',
                'rgba(251,154,153, 0.2)',
                'rgba(227,26,28, 0.2)',
                'rgba(253,191,111, 0.2)',
                'rgba(255,127,0, 0.2)',
                'rgba(202,178,214, 0.2)',
                'rgba(106,61,154, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(166,206,227, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(31,120,180, 1)',
                'rgba(178,223,138, 1)',
                'rgba(51,160,44, 1)',
                'rgba(251,154,153, 1)',
                'rgba(227,26,28, 1)',
                'rgba(253,191,111, 1)',
                'rgba(255,127,0, 1)',
                'rgba(202,178,214, 1)',
                'rgba(106,61,154, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
      maintainAspectRatio: false,
      scales: {
          y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Distance (Km)'
              }
          },
          x: {
            title: {
              display: true,
              text: 'Criteria'
            }
          }
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          text: 'Average Distance to Criteria for Cell ' + cell_id + ' (Km)',
          display: true,
        }
      }
    },
  });

  var ctx_cat = document.getElementById('categoriesChart').getContext('2d');
  window.catChart = new Chart(ctx_cat, {
    type: 'bar',
    data: {
        labels: ['Accessibility', 'Livability', 'Suitability'],
        datasets: [{
            label: ['Category'],
            data: [accessibility_match, livability_match, suitability_match],
            backgroundColor: [
                'rgba(127,201,127, 0.2)',
                'rgba(190,174,212, 0.2)',
                'rgba(253,192,134, 0.2)'
            ],
            borderColor: [
                'rgba(127,201,127, 1)',
                'rgba(190,174,212, 1)',
                'rgba(253,192,134, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
      maintainAspectRatio: false,
      scales: {
          y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Percent Match (%)'
              }
          },
          x: {
            title: {
              display: true,
              text: 'Category'
            }
          }
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          text: 'Accessibility, Livability, & Suitability Scores',
          display: true,
        }
      }
    },
  });
});

// Change the cursor if on targer layer
map.on('pointermove', function(e) {
  if (e.dragging) return;

  var pixel = e.map.getEventPixel(e.originalEvent);
  var hit = false;
  e.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    if (layer == grid100km, grid30km, grid1km_vectorimage_hovestad, grid1km_vectorimage_fyn, grid1km_vectorimage_midtjylland, grid1km_vectorimage_midtjyllandw, grid1km_vectorimage_sjælland) {
          hit = true;
     }
  });

  e.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});