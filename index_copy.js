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
  if (fuzzyvalue < 0.05) {
    layercolor='rgba(0, 0, 0, 0)'
    }
    else if (fuzzyvalue < 0.2) {
    layercolor='rgba(217, 200, 0, 0.6)';
    }
    else if (fuzzyvalue < 0.6) {
    layercolor='rgba(0, 200, 0, 0.6)';
    }
    else if (fuzzyvalue <= 1) {
    layercolor='rgba(0, 100, 0, 0.6)';
    }
    else { layercolor='rgba(217, 200, 0, 0)';
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
  if (fuzzyvalue < 0.05) {
    layercolor='rgba(0, 0, 0, 0)'
    }
    else if (fuzzyvalue < 0.2) {
    layercolor='rgba(217, 200, 0, 0.6)';
    }
    else if (fuzzyvalue < 0.6) {
    layercolor='rgba(0, 200, 0, 0.6)';
    }
    else if (fuzzyvalue <= 1) {
    layercolor='rgba(0, 100, 0, 0.6)';
    }
    else { layercolor='rgba(217, 200, 0, 0)';
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
  if (fuzzyvalue < 0.05) {
    layercolor='rgba(0, 0, 0, 0)'
    }
    else if (fuzzyvalue < 0.2) {
    layercolor='rgba(217, 200, 0, 0.6)';
    }
    else if (fuzzyvalue < 0.6) {
    layercolor='rgba(0, 200, 0, 0.6)';
    }
    else if (fuzzyvalue <= 1) {
    layercolor='rgba(0, 100, 0, 0.6)';
    }
    else { layercolor='rgba(217, 200, 0, 0)';
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
  var coasts_1_hovestad;
  var hospitals_1_hovestad;
  var parks_1_hovestad;
  var roads_1_hovestad;
  var schools_1_hovestad;
  var markets_1_hovestad;
  var uni_1_hovestad;
  var stops_1_hovestad;
  var stations_1_hovestad;
  var restuarants_1_hovestad;
  var theatres_1_hovestad;
  var cinemas_1_hovestad;
  var kinder_1_hovestad;
  var industries_1_hovestad;
  var houseprice_1_hovestad;
  var water_1_hovestad;
  var new_fuzzy_value_1km_hovestad;
  var accessibility_1_hovestad;
  var livability_1_hovestad;
  var suitability_1_hovestad;

  features_1km_hovestad.forEach(function(feature){
    if (parseInt(sliderUni.value) > (feature.get("_univers_2")/1000)) {
      uni_1_hovestad = 0}
      else if (parseInt(sliderUni.value) == (feature.get("_univers_2")/1000)) {
        uni_1_hovestad = 0
      }
      else if (parseInt(sliderUni.value) < (feature.get("_univers_2")/1000)) {
        uni_1_hovestad = (sliderUni.value - (feature.get("_univers_1")/1000)) / ((feature.get("_univers_2") - feature.get("_univers_1"))/1000)
        if (uni_1_hovestad < 0) {
          uni_1_hovestad = 0;
        }
        else if (uni_1_hovestad <= 100) {
        }
      }
    if (parseInt(sliderRoads.value) > (feature.get("_roadsmax")/1000)) {
      roads_1_hovestad = 0;}
      else if (parseInt(sliderRoads.value) == (feature.get("_roadsmax")/1000)) {
        roads_1_hovestad = 0
      }
      else if (parseInt(sliderRoads.value) < (feature.get("_roadsmax")/1000)) {
        roads_1_hovestad = (sliderRoads.value - (feature.get("_roadsmin")/1000)) / ((feature.get("_roadsmax") - feature.get("_roadsmin"))/1000)
        if (roads_1_hovestad < 0) {
          roads_1_hovestad = 0;
        }
        else if (roads_1_hovestad <= 100) {
        }
      }
    if (parseInt(sliderCoasts.value) > (feature.get("_coastli_2")/1000)) {
      coasts_1_hovestad = 0;}
      else if (parseInt(sliderCoasts.value) == (feature.get("_coastli_2")/1000)) {
        coasts_1_hovestad = 0
      }
      else if (parseInt(sliderCoasts.value) < (feature.get("_coastli_2")/1000)) {
        coasts_1_hovestad = (sliderCoasts.value - (feature.get("_coastli_1")/1000)) / ((feature.get("_coastli_2") - feature.get("_coastli_1"))/1000)
        if (coasts_1_hovestad < 0) {
          coasts_1_hovestad = 0;
        }
        else if (coasts_1_hovestad <= 100) {
        }
      }
    if (parseInt(sliderHospitals.value) > (feature.get("_hospita_2")/1000)) {
      hospitals_1_hovestad = 0;}
      else if (parseInt(sliderHospitals.value) == (feature.get("_hospita_2")/1000)) {
        hospitals_1_hovestad = 0
      }
      else if (parseInt(sliderHospitals.value) < (feature.get("_hospita_2")/1000)) {
        hospitals_1_hovestad = (sliderHospitals.value - (feature.get("_hospita_1")/1000)) / ((feature.get("_hospita_2") - feature.get("_hospita_1"))/1000)
        if (hospitals_1_hovestad < 0) {
          hospitals_1_hovestad = 0;
        }
        else if (hospitals_1_hovestad <= 100) {
        }
      }
    if (parseInt(sliderParks.value) > (feature.get("_leisure_2")/1000)) {
      parks_1_hovestad = 0;}
      else if (parseInt(sliderParks.value) == (feature.get("_leisure_2")/1000)) {
        parks__1_hovestad = 0
      }
      else if (parseInt(sliderParks.value) < (feature.get("_leisure_2")/1000)) {
        parks_1_hovestad = (sliderParks.value - (feature.get("_leisure_1")/1000)) / ((feature.get("_leisure_2") - feature.get("_leisure_1"))/1000)
        if (parks_1_hovestad < 0) {
          parks_1_hovestad = 0;
        }
        else if (parks_1_hovestad <= 100) {
        }
      }
    if (parseInt(sliderSchools.value) > (feature.get("_schoolsma")/1000)) {
      schools_1_hovestad = 0;}
      else if (parseInt(sliderSchools.value) == (feature.get("_schoolsma")/1000)) {
        schools_1_hovestad = 0
      }
      else if (parseInt(sliderSchools.value) < (feature.get("_schoolsma")/1000)) {
        schools_1_hovestad = (sliderSchools.value - (feature.get("_schoolsmi")/1000)) / ((feature.get("_schoolsma") - feature.get("_schoolsmi"))/1000)
        if (schools_1_sjælland < 0) {
          schools_1_hovestad = 0;
        }
        else if (schools_1_hovestad <= 100) {
        }
      }
    if (parseInt(sliderMarkets.value) > (feature.get("_superma_2")/1000)) {
      markets_1_hovestad = 0;}
      else if (parseInt(sliderMarkets.value) == (feature.get("_superma_2")/1000)) {
        markets_1_hovestad = 0
      }
      else if (parseInt(sliderMarkets.value) < (feature.get("_superma_2")/1000)) {
        markets_1_hovestad = (sliderMarkets.value - (feature.get("_superma_1")/1000)) / ((feature.get("_superma_2") - feature.get("_superma_1"))/1000)
        if (markets_1_hovestad < 0) {
          markets_1_hovestad = 0;
        }
        else if (markets_1_hovestad <= 100) {
        }
      }
    if (parseInt(sliderPstops.value) > (feature.get("_pt_stop_2")/1000)) {
      stops_1_hovestad = 0;}
      else if (parseInt(sliderPstops.value) == (feature.get("_pt_stop_2")/1000)) {
        stops_1_hovestad = 0
      }
      else if (parseInt(sliderPstops.value) < (feature.get("_pt_stop_2")/1000)) {
        stops_1_hovestad = (sliderPstops.value - (feature.get("_pt_stop_1")/1000)) / ((feature.get("_pt_stop_2") - feature.get("_pt_stop_1"))/1000)
        if (stops_1_hovestad < 0) {
          stops_1_hovestad = 0;
        }
        else if (stops_1_hovestad <= 100) {
        }
      }
    if (parseInt(sliderPstations.value) > (feature.get("_pt_stat_2")/1000)) {
      stations_1_hovestad = 0;}
      else if (parseInt(sliderPstations.value) == (feature.get("_pt_stat_2")/1000)) {
        stations_1_hovestad = 0
      }
      else if (parseInt(sliderPstations.value) < (feature.get("_pt_stat_2")/1000)) {
        stations_1_hovestad = (sliderPstations.value - (feature.get("_pt_stat_1")/1000)) / ((feature.get("_pt_stat_2") - feature.get("_pt_stat_1"))/1000)
        if (stations_1_hovestad < 0) {
          stations_1_hovestad = 0;
        }
        else if (stations_1_hovestad <= 100) {
        }
      }
    if (parseInt(sliderRestuarants.value) > (feature.get("_restaur_2")/1000)) {
      restuarants_1_hovestad = 0;}
      else if (parseInt(sliderRestuarants.value) == (feature.get("_restaur_2")/1000)) {
        restuarants_1_hovestad = 0
      }
      else if (parseInt(sliderRestuarants.value) < (feature.get("_restaur_2")/1000)) {
        restuarants_1_hovestad = (sliderRestuarants.value - (feature.get("_restaur_1")/1000)) / ((feature.get("_restaur_2") - feature.get("_restaur_1"))/1000)
        if (restuarants_1_hovestad < 0) {
          restuarants_1_hovestad = 0;
        }
        else if (restuarants_1_hovestad <= 100) {
        }
      }
    if (parseInt(sliderTheatres.value) > (feature.get("_theatre_2")/1000)) {
      theatres_1_hovestad = 0;}
      else if (parseInt(sliderTheatres.value) == (feature.get("_theatre_2")/1000)) {
        theatres_1_hovestad = 0
      }
      else if (parseInt(sliderTheatres.value) < (feature.get("_theatre_2")/1000)) {
        theatres_1_hovestad = (sliderTheatres.value - (feature.get("_theatre_1")/1000)) / ((feature.get("_theatre_2") - feature.get("_theatre_1"))/1000)
        if (theatres_1_hovestad < 0) {
          theatres_1_hovestad = 0;
        }
        else if (theatres_1_hovestad <= 100) {
        }
      }
    if (parseInt(sliderCinemas.value) > (feature.get("_cinemasma")/1000)) {
      cinemas_1_hovestad = 0;}
      else if (parseInt(sliderCinemas.value) == (feature.get("_cinemasma")/1000)) {
        cinemas_1_hovestad = 0
      }
      else if (parseInt(sliderCinemas.value) < (feature.get("_cinemasma")/1000)) {
        cinemas_1_hovestad = (sliderCinemas.value - (feature.get("_cinemasmi")/1000)) / ((feature.get("_cinemasma") - feature.get("_cinemasmi"))/1000)
        if (cinemas_1_hovestad < 0) {
          cinemas_1_hovestad = 0;
        }
        else if (cinemas_1_hovestad <= 100) {
        }
      }
    if (parseInt(sliderKinder.value) > (feature.get("_kindermax")/1000)) {
      kinder_1_hovestad = 0;}
      else if (parseInt(sliderKinder.value) == (feature.get("_kindermax")/1000)) {
        kinder_1_hovestad = 0
      }
      else if (parseInt(sliderKinder.value) < (feature.get("_kindermax")/1000)) {
        kinder_1_hovestad = (sliderKinder.value - (feature.get("_kindermin")/1000)) / ((feature.get("_kindermax") - feature.get("_kindermin"))/1000)
        if (kinder_1_hovestad < 0) {
          kinder_1_hovestad = 0;
        }
        else if (kinder_1_hovestad <= 100) {
        }
      }
    if (parseInt(sliderIndustry.value) > (feature.get("_industr_2")/1000)) {
      industries_1_hovestad = 0;}
      else if (parseInt(sliderIndustry.value) == (feature.get("_industr_2")/1000)) {
        industries_1_hovestad = 0
      }
      else if (parseInt(sliderIndustry.value) < (feature.get("_industr_2")/1000)) {
        industries_1_hovestad = (sliderIndustry.value - (feature.get("_industr_1")/1000)) / ((feature.get("_industr_2") - feature.get("_industr_1"))/1000)
        if (industries_1_hovestad < 0) {
          industries_1_hovestad = 0;
        }
        else if (industries_1_hovestad <= 100) {
        }
      }
    if (parseInt(sliderHprice.value) > feature.get("housepri_3")) {
      houseprice_1_hovestad = 0;}
      else if (parseInt(sliderHprice.value) == feature.get("housepri_3")) {
        houseprice_1_hovestad = 0
      }
      else if (parseInt(sliderHprice.value) < feature.get("housepri_3")) {
        houseprice_1_hovestad = ((sliderHprice.value - feature.get("housepri_2")) / (feature.get("housepri_3") - feature.get("housepri_2")))
        if (houseprice_1_hovestad < 0) {
          houseprice_1_hovestad = 0;
        }
        else if (houseprice_1_hovestad <= 100) {
        }
      }
    if (parseInt(sliderWater.value) > feature.get("_waterbo_2")) {
      water_1_hovestad = 0;}
      else if (parseInt(sliderWater.value) == feature.get("_waterbo_2")) {
        water_1_hovestad = 0
      }
      else if (parseInt(sliderWater.value) < feature.get("_waterbo_2")) {
        water_1_hovestad = ((sliderWater.value - feature.get("_waterbo_1")) / (feature.get("_waterbo_2") - feature.get("_waterbo_1")))
        if (water_1_hovestad < 0) {
          water_1_hovestad = 0;
        }
        else if (water_1_hovestad <= 100) {
        }
      }
    new_fuzzy_value_1km_hovestad = ((coasts_1_hovestad + hospitals_1_hovestad + parks_1_hovestad + roads_1_hovestad + schools_1_hovestad + markets_1_hovestad + uni_1_hovestad + stops_1_hovestad + stations_1_hovestad + restuarants_1_hovestad + theatres_1_hovestad + cinemas_1_hovestad + kinder_1_hovestad + industries_1_hovestad + houseprice_1_hovestad)/16);
    feature.set("fuzzyvalue", new_fuzzy_value_1km_hovestad);
    accessibility_1_hovestad = (((roads_1_hovestad + stops_1_hovestad + stations_1_hovestad) / 3) * 100);
    livability_1_hovestad = (((uni_1_hovestad + schools_1_hovestad + kinder_1_hovestad + coasts_1_hovestad + markets_1_hovestad + water_1_hovestad + industries_1_hovestad + hospitals_1_hovestad + restuarants_1_hovestad + theatres_1_hovestad + cinemas_1_hovestad + parks_1_hovestad) / 12) * 100);
    suitability_1_hovestad = (((houseprice_1_hovestad) / 1) * 100);
    feature.set("accessibility", accessibility_1_hovestad);
    feature.set("livability", livability_1_hovestad);
    feature.set("suitability", suitability_1_hovestad);
  });

  // Calculate Weights for 1km Grid - Sjælland
  var source_1km_sjælland = grid1km_vectorimage_sjælland.getSource();
  var features_1km_sjælland = source_1km_sjælland.getFeatures();
  var coasts_1_sjælland;
  var hospitals_1_sjælland;
  var parks_1_sjælland;
  var roads_1_sjælland;
  var schools_1_sjælland;
  var markets_1_sjælland;
  var uni_1_sjælland;
  var stops_1_sjælland;
  var stations_1_sjælland;
  var restuarants_1_sjælland;
  var theatres_1_sjælland;
  var cinemas_1_sjælland;
  var kinder_1_sjælland;
  var industries_1_sjælland;
  var houseprice_1_sjælland;
  var water_1_sjælland;
  var new_fuzzy_value_1km_sjælland;
  var accessibility_1_sjælland;
  var livability_1_sjælland;
  var suitability_1_sjælland;

  features_1km_sjælland.forEach(function(feature){
    if (parseInt(sliderUni.value) > (feature.get("_univers_2")/1000)) {
      uni_1_sjælland = 0}
      else if (parseInt(sliderUni.value) == (feature.get("_univers_2")/1000)) {
        uni_1_sjælland = 0
      }
      else if (parseInt(sliderUni.value) < (feature.get("_univers_2")/1000)) {
        uni_1_sjælland = (sliderUni.value - (feature.get("_univers_1")/1000)) / ((feature.get("_univers_2") - feature.get("_univers_1"))/1000)
        if (uni_1_sjælland < 0) {
          uni_1_sjælland = 0;
        }
        else if (uni_1_sjælland <= 100) {
        }
      }
    if (parseInt(sliderRoads.value) > (feature.get("_roadsmax")/1000)) {
      roads_1_sjælland = 0;}
      else if (parseInt(sliderRoads.value) == (feature.get("_roadsmax")/1000)) {
        roads_1_sjælland = 0
      }
      else if (parseInt(sliderRoads.value) < (feature.get("_roadsmax")/1000)) {
        roads_1_sjælland = (sliderRoads.value - (feature.get("_roadsmin")/1000)) / ((feature.get("_roadsmax") - feature.get("_roadsmin"))/1000)
        if (roads_1_sjælland < 0) {
          roads_1_sjælland = 0;
        }
        else if (roads_1_sjælland <= 100) {
        }
      }
    if (parseInt(sliderCoasts.value) > (feature.get("_coastli_2")/1000)) {
      coasts_1_sjælland = 0;}
      else if (parseInt(sliderCoasts.value) == (feature.get("_coastli_2")/1000)) {
        coasts_1_sjælland = 0
      }
      else if (parseInt(sliderCoasts.value) < (feature.get("_coastli_2")/1000)) {
        coasts_1_sjælland = (sliderCoasts.value - (feature.get("_coastli_1")/1000)) / ((feature.get("_coastli_2") - feature.get("_coastli_1"))/1000)
        if (coasts_1_sjælland < 0) {
          coasts_1_sjælland = 0;
        }
        else if (coasts_1_sjælland <= 100) {
        }
      }
    if (parseInt(sliderHospitals.value) > (feature.get("_hospita_2")/1000)) {
      hospitals_1_sjælland = 0;}
      else if (parseInt(sliderHospitals.value) == (feature.get("_hospita_2")/1000)) {
        hospitals_1_sjælland = 0
      }
      else if (parseInt(sliderHospitals.value) < (feature.get("_hospita_2")/1000)) {
        hospitals_1_sjælland = (sliderHospitals.value - (feature.get("_hospita_1")/1000)) / ((feature.get("_hospita_2") - feature.get("_hospita_1"))/1000)
        if (hospitals_1_sjælland < 0) {
          hospitals_1_sjælland = 0;
        }
        else if (hospitals_1_sjælland <= 100) {
        }
      }
    if (parseInt(sliderParks.value) > (feature.get("_leisure_2")/1000)) {
      parks_1_sjælland = 0;}
      else if (parseInt(sliderParks.value) == (feature.get("_leisure_2")/1000)) {
        parks_1_sjælland = 0
      }
      else if (parseInt(sliderParks.value) < (feature.get("_leisure_2")/1000)) {
        parks_1_sjælland = (sliderParks.value - (feature.get("_leisure_1")/1000)) / ((feature.get("_leisure_2") - feature.get("_leisure_1"))/1000)
        if (parks_1_sjælland < 0) {
          parks_1_sjælland = 0;
        }
        else if (parks_1_sjælland <= 100) {
        }
      }
    if (parseInt(sliderSchools.value) > (feature.get("_schoolsma")/1000)) {
      schools_1_sjælland = 0;}
      else if (parseInt(sliderSchools.value) == (feature.get("_schoolsma")/1000)) {
        schools_1_sjælland = 0
      }
      else if (parseInt(sliderSchools.value) < (feature.get("_schoolsma")/1000)) {
        schools_1_sjælland = (sliderSchools.value - (feature.get("_schoolsmi")/1000)) / ((feature.get("_schoolsma") - feature.get("_schoolsmi"))/1000)
        if (schools_1_sjælland < 0) {
          schools_1_sjælland = 0;
        }
        else if (schools_1_sjælland <= 100) {
        }
      }
    if (parseInt(sliderMarkets.value) > (feature.get("_superma_2")/1000)) {
      markets_1_sjælland = 0;}
      else if (parseInt(sliderMarkets.value) == (feature.get("_superma_2")/1000)) {
        markets_1_sjælland = 0
      }
      else if (parseInt(sliderMarkets.value) < (feature.get("_superma_2")/1000)) {
        markets_1_sjælland = (sliderMarkets.value - (feature.get("_superma_1")/1000)) / ((feature.get("_superma_2") - feature.get("_superma_1"))/1000)
        if (markets_1_sjælland < 0) {
          markets_1_sjælland = 0;
        }
        else if (markets_1_sjælland <= 100) {
        }
      }
    if (parseInt(sliderPstops.value) > (feature.get("_pt_stop_2")/1000)) {
      stops_1_sjælland = 0;}
      else if (parseInt(sliderPstops.value) == (feature.get("_pt_stop_2")/1000)) {
        stops_1_sjælland = 0
      }
      else if (parseInt(sliderPstops.value) < (feature.get("_pt_stop_2")/1000)) {
        stops_1_sjælland = (sliderPstops.value - (feature.get("_pt_stop_1")/1000)) / ((feature.get("_pt_stop_2") - feature.get("_pt_stop_1"))/1000)
        if (stops_1_sjælland < 0) {
          stops_1_sjælland = 0;
        }
        else if (stops_1_sjælland <= 100) {
        }
      }
    if (parseInt(sliderPstations.value) > (feature.get("_pt_stat_2")/1000)) {
      stations_1_sjælland = 0;}
      else if (parseInt(sliderPstations.value) == (feature.get("_pt_stat_2")/1000)) {
        stations_1_sjælland = 0
      }
      else if (parseInt(sliderPstations.value) < (feature.get("_pt_stat_2")/1000)) {
        stations_1_sjælland = (sliderPstations.value - (feature.get("_pt_stat_1")/1000)) / ((feature.get("_pt_stat_2") - feature.get("_pt_stat_1"))/1000)
        if (stations_1_sjælland < 0) {
          stations_1_sjælland = 0;
        }
        else if (stations_1_sjælland <= 100) {
        }
      }
    if (parseInt(sliderRestuarants.value) > (feature.get("_restaur_2")/1000)) {
      restuarants_1_sjælland = 0;}
      else if (parseInt(sliderRestuarants.value) == (feature.get("_restaur_2")/1000)) {
        restuarants_1_sjælland = 0
      }
      else if (parseInt(sliderRestuarants.value) < (feature.get("_restaur_2")/1000)) {
        restuarants_1_sjælland = (sliderRestuarants.value - (feature.get("_restaur_1")/1000)) / ((feature.get("_restaur_2") - feature.get("_restaur_1"))/1000)
        if (restuarants_1_sjælland < 0) {
          restuarants_1_sjælland = 0;
        }
        else if (restuarants_1_sjælland <= 100) {
        }
      }
    if (parseInt(sliderTheatres.value) > (feature.get("_theatre_2")/1000)) {
      theatres_1_sjælland = 0;}
      else if (parseInt(sliderTheatres.value) == (feature.get("_theatre_2")/1000)) {
        theatres_1_sjælland = 0
      }
      else if (parseInt(sliderTheatres.value) < (feature.get("_theatre_2")/1000)) {
        theatres_1_sjælland = (sliderTheatres.value - (feature.get("_theatre_1")/1000)) / ((feature.get("_theatre_2") - feature.get("_theatre_1"))/1000)
        if (theatres_1_sjælland < 0) {
          theatres_1_sjælland = 0;
        }
        else if (theatres_1_sjælland <= 100) {
        }
      }
    if (parseInt(sliderCinemas.value) > (feature.get("_cinemasma")/1000)) {
      cinemas_1_sjælland = 0;}
      else if (parseInt(sliderCinemas.value) == (feature.get("_cinemasma")/1000)) {
        cinemas_1_sjælland = 0
      }
      else if (parseInt(sliderCinemas.value) < (feature.get("_cinemasma")/1000)) {
        cinemas_1_sjælland = (sliderCinemas.value - (feature.get("_cinemasmi")/1000)) / ((feature.get("_cinemasma") - feature.get("_cinemasmi"))/1000)
        if (cinemas_1_sjælland < 0) {
          cinemas_1_sjælland = 0;
        }
        else if (cinemas_1_sjælland <= 100) {
        }
      }
    if (parseInt(sliderKinder.value) > (feature.get("_kindermax")/1000)) {
      kinder_1_sjælland = 0;}
      else if (parseInt(sliderKinder.value) == (feature.get("_kindermax")/1000)) {
        kinder_1_sjælland = 0
      }
      else if (parseInt(sliderKinder.value) < (feature.get("_kindermax")/1000)) {
        kinder_1_sjælland = (sliderKinder.value - (feature.get("_kindermin")/1000)) / ((feature.get("_kindermax") - feature.get("_kindermin"))/1000)
        if (kinder_1_sjælland < 0) {
          kinder_1_sjælland = 0;
        }
        else if (kinder_1_sjælland <= 100) {
        }
      }
    if (parseInt(sliderIndustry.value) > (feature.get("_industr_2")/1000)) {
      industries_1_sjælland = 0;}
      else if (parseInt(sliderIndustry.value) == (feature.get("_industr_2")/1000)) {
        industries_1_sjælland = 0
      }
      else if (parseInt(sliderIndustry.value) < (feature.get("_industr_2")/1000)) {
        industries_1_sjælland = (sliderIndustry.value - (feature.get("_industr_1")/1000)) / ((feature.get("_industr_2") - feature.get("_industr_1"))/1000)
        if (industries_1_sjælland < 0) {
          industries_1_sjælland = 0;
        }
        else if (industries_1_sjælland <= 100) {
        }
      }
    if (parseInt(sliderHprice.value) > feature.get("housepri_3")) {
      houseprice_1_sjælland = 0;}
      else if (parseInt(sliderHprice.value) == feature.get("housepri_3")) {
        houseprice_1_sjælland = 0
      }
      else if (parseInt(sliderHprice.value) < feature.get("housepri_3")) {
        houseprice_1_sjælland = ((sliderHprice.value - feature.get("housepri_2")) / (feature.get("housepri_3") - feature.get("housepri_2")))
        if (houseprice_1_sjælland < 0) {
          houseprice_1_sjælland = 0;
        }
        else if (houseprice_1_sjælland <= 100) {
        }
      }
    if (parseInt(sliderWater.value) > feature.get("_waterbo_2")) {
      water_1_sjælland = 0;}
      else if (parseInt(sliderWater.value) == feature.get("_waterbo_2")) {
        houseprice_1_sjælland = 0
      }
      else if (parseInt(sliderWater.value) < feature.get("_waterbo_2")) {
        houseprice_1_sjælland = ((sliderWater.value - feature.get("_waterbo_1")) / (feature.get("_waterbo_2") - feature.get("_waterbo_1")))
        if (houseprice_1_sjælland < 0) {
          houseprice_1_sjælland = 0;
        }
        else if (houseprice_1_sjælland <= 100) {
        }
      }
    new_fuzzy_value_1km_sjælland = (coasts_1_sjælland + hospitals_1_sjælland + parks_1_sjælland + roads_1_sjælland + schools_1_sjælland + markets_1_sjælland + uni_1_sjælland + stops_1_sjælland + stations_1_sjælland + restuarants_1_sjælland + theatres_1_sjælland + cinemas_1_sjælland + kinder_1_sjælland + industries_1_sjælland + houseprice_1_sjælland)/16;
    feature.set("fuzzyvalue", new_fuzzy_value_1km_sjælland);
    accessibility_1_sjælland = (((roads_1_sjælland + stops_1_sjælland + stations_1_sjælland) / 3) * 100);
    livability_1_sjælland = (((uni_1_sjælland + schools_1_sjælland + kinder_1_sjælland + coasts_1_sjælland + markets_1_sjælland + water_1_sjælland + industries_1_sjælland + hospitals_1_sjælland + restuarants_1_sjælland + theatres_1_sjælland + cinemas_1_sjælland + parks_1_sjælland) / 12) * 100);
    suitability_1_sjælland = (((houseprice_1_sjælland) / 1) * 100);
    feature.set("accessibility", accessibility_1_sjælland);
    feature.set("livability", livability_1_sjælland);
    feature.set("suitability", suitability_1_sjælland);
  });

  // Calculate Weights for 1km Grid - Fyn
  var source_1km_fyn = grid1km_vectorimage_fyn.getSource();
  var features_1km_fyn = source_1km_fyn.getFeatures();
  var coasts_1_fyn;
  var hospitals_1_fyn;
  var parks_1_fyn;
  var roads_1_fyn;
  var schools_1_fyn;
  var markets_1_fyn;
  var uni_1_fyn;
  var stops_1_fyn;
  var stations_1_fyn;
  var restuarants_1_fyn;
  var theatres_1_fyn;
  var cinemas_1_fyn;
  var kinder_1_fyn;
  var industries_1_fyn;
  var houseprice_1_fyn;
  var water_1_fyn;
  var new_fuzzy_value_1km_fyn;
  var accessibility_1_fyn;
  var livability_1_fyn;
  var suitability_1_fyn;

  features_1km_fyn.forEach(function(feature){
    if (parseInt(sliderUni.value) > (feature.get("_univers_2")/1000)) {
      uni_1_fyn = 0}
      else if (parseInt(sliderUni.value) == (feature.get("_univers_2")/1000)) {
        uni_1_fyn = 0
      }
      else if (parseInt(sliderUni.value) < (feature.get("_univers_2")/1000)) {
        uni_1_fyn = (sliderUni.value - (feature.get("_univers_1")/1000)) / ((feature.get("_univers_2") - feature.get("_univers_1"))/1000)
        if (uni_1_fyn < 0) {
          uni_1_fyn = 0;
        }
        else if (uni_1_fyn <= 100) {
        }
      }
    if (parseInt(sliderRoads.value) > (feature.get("_roadsmax")/1000)) {
      roads_1_fyn = 0;}
      else if (parseInt(sliderRoads.value) == (feature.get("_roadsmax")/1000)) {
        roads_1_fyn = 0
      }
      else if (parseInt(sliderRoads.value) < (feature.get("_roadsmax")/1000)) {
        roads_1_fyn = (sliderRoads.value - (feature.get("_roadsmin")/1000)) / ((feature.get("_roadsmax") - feature.get("_roadsmin"))/1000)
        if (roads_1_fyn < 0) {
          roads_1_fyn = 0;
        }
        else if (roads_1_fyn <= 100) {
        }
      }
    if (parseInt(sliderCoasts.value) > (feature.get("_coastli_2")/1000)) {
      coasts_1_fyn = 0;}
      else if (parseInt(sliderCoasts.value) == (feature.get("_coastli_2")/1000)) {
        coasts_1_fyn = 0
      }
      else if (parseInt(sliderCoasts.value) < (feature.get("_coastli_2")/1000)) {
        coasts_1_fyn = (sliderCoasts.value - (feature.get("_coastli_1")/1000)) / ((feature.get("_coastli_2") - feature.get("_coastli_1"))/1000)
        if (coasts_1_fyn < 0) {
          coasts_1_fyn = 0;
        }
        else if (coasts_1_fyn <= 100) {
        }
      }
    if (parseInt(sliderHospitals.value) > (feature.get("_hospita_2")/1000)) {
      hospitals_1_fyn = 0;}
      else if (parseInt(sliderHospitals.value) == (feature.get("_hospita_2")/1000)) {
        hospitals_1_fyn = 0
      }
      else if (parseInt(sliderHospitals.value) < (feature.get("_hospita_2")/1000)) {
        hospitals_1_fyn = (sliderHospitals.value - (feature.get("_hospita_1")/1000)) / ((feature.get("_hospita_2") - feature.get("_hospita_1"))/1000)
        if (hospitals_1_fyn < 0) {
          hospitals_1_fyn = 0;
        }
        else if (hospitals_1_fyn <= 100) {
        }
      }
    if (parseInt(sliderParks.value) > (feature.get("_leisure_2")/1000)) {
      parks_1_fyn = 0;}
      else if (parseInt(sliderParks.value) == (feature.get("_leisure_2")/1000)) {
        parks_1_fyn = 0
      }
      else if (parseInt(sliderParks.value) < (feature.get("_leisure_2")/1000)) {
        parks_1_fyn = (sliderParks.value - (feature.get("_leisure_1")/1000)) / ((feature.get("_leisure_2") - feature.get("_leisure_1"))/1000)
        if (parks_1_fyn < 0) {
          parks_1_fyn = 0;
        }
        else if (parks_1_fyn <= 100) {
        }
      }
    if (parseInt(sliderSchools.value) > (feature.get("_schoolsma")/1000)) {
      schools_1_fyn = 0;}
      else if (parseInt(sliderSchools.value) == (feature.get("_schoolsma")/1000)) {
        schools_1_fyn = 0
      }
      else if (parseInt(sliderSchools.value) < (feature.get("_schoolsma")/1000)) {
        schools_1_fyn = (sliderSchools.value - (feature.get("_schoolsmi")/1000)) / ((feature.get("_schoolsma") - feature.get("_schoolsmi"))/1000)
        if (schools_1_fyn < 0) {
          schools_1_fyn = 0;
        }
        else if (schools_1_fyn <= 100) {
        }
      }
    if (parseInt(sliderMarkets.value) > (feature.get("_superma_2")/1000)) {
      markets_1_fyn = 0;}
      else if (parseInt(sliderMarkets.value) == (feature.get("_superma_2")/1000)) {
        markets_1_fyn = 0
      }
      else if (parseInt(sliderMarkets.value) < (feature.get("_superma_2")/1000)) {
        markets_1_fyn = (sliderMarkets.value - (feature.get("_superma_1")/1000)) / ((feature.get("_superma_2") - feature.get("_superma_1"))/1000)
        if (markets_1_fyn < 0) {
          markets_1_fyn = 0;
        }
        else if (markets_1_fyn <= 100) {
        }
      }
    if (parseInt(sliderPstops.value) > (feature.get("_pt_stop_2")/1000)) {
      stops_1_fyn = 0;}
      else if (parseInt(sliderPstops.value) == (feature.get("_pt_stop_2")/1000)) {
        stops_1_fyn = 0
      }
      else if (parseInt(sliderPstops.value) < (feature.get("_pt_stop_2")/1000)) {
        stops_1_fyn = (sliderPstops.value - (feature.get("_pt_stop_1")/1000)) / ((feature.get("_pt_stop_2") - feature.get("_pt_stop_1"))/1000)
        if (stops_1_fyn < 0) {
          stops_1_fyn = 0;
        }
        else if (stops_1_fyn <= 100) {
        }
      }
    if (parseInt(sliderPstations.value) > (feature.get("_pt_stat_2")/1000)) {
      stations_1_fyn = 0;}
      else if (parseInt(sliderPstations.value) == (feature.get("_pt_stat_2")/1000)) {
        stations_1_fyn = 0
      }
      else if (parseInt(sliderPstations.value) < (feature.get("_pt_stat_2")/1000)) {
        stations_1_fyn = (sliderPstations.value - (feature.get("_pt_stat_1")/1000)) / ((feature.get("_pt_stat_2") - feature.get("_pt_stat_1"))/1000)
        if (stations_1_fyn < 0) {
          stations_1_fyn = 0;
        }
        else if (stations_1_fyn <= 100) {
        }
      }
    if (parseInt(sliderRestuarants.value) > (feature.get("_restaur_2")/1000)) {
      restuarants_1_fyn = 0;}
      else if (parseInt(sliderRestuarants.value) == (feature.get("_restaur_2")/1000)) {
        restuarants_1_fyn = 0
      }
      else if (parseInt(sliderRestuarants.value) < (feature.get("_restaur_2")/1000)) {
        restuarants_1_fyn = (sliderRestuarants.value - (feature.get("_restaur_1")/1000)) / ((feature.get("_restaur_2") - feature.get("_restaur_1"))/1000)
        if (restuarants_1_fyn < 0) {
          restuarants_1_fyn = 0;
        }
        else if (restuarants_1_fyn <= 100) {
        }
      }
    if (parseInt(sliderTheatres.value) > (feature.get("_theatre_2")/1000)) {
      theatres_1_fyn = 0;}
      else if (parseInt(sliderTheatres.value) == (feature.get("_theatre_2")/1000)) {
        theatres_1_fyn = 0
      }
      else if (parseInt(sliderTheatres.value) < (feature.get("_theatre_2")/1000)) {
        theatres_1_fyn = (sliderTheatres.value - (feature.get("_theatre_1")/1000)) / ((feature.get("_theatre_2") - feature.get("_theatre_1"))/1000)
        if (theatres_1_fyn < 0) {
          theatres_1_fyn = 0;
        }
        else if (theatres_1_fyn <= 100) {
        }
      }
    if (parseInt(sliderCinemas.value) > (feature.get("_cinemasma")/1000)) {
      cinemas_1_fyn = 0;}
      else if (parseInt(sliderCinemas.value) == (feature.get("_cinemasma")/1000)) {
        cinemas_1_fyn = 0
      }
      else if (parseInt(sliderCinemas.value) < (feature.get("_cinemasma")/1000)) {
        cinemas_1_fyn = (sliderCinemas.value - (feature.get("_cinemasmi")/1000)) / ((feature.get("_cinemasma") - feature.get("_cinemasmi"))/1000)
        if (cinemas_1_fyn < 0) {
          cinemas_1_fyn = 0;
        }
        else if (cinemas_1_fyn <= 100) {
        }
      }
    if (parseInt(sliderKinder.value) > (feature.get("_kindermax")/1000)) {
      kinder_1_fyn = 0;}
      else if (parseInt(sliderKinder.value) == (feature.get("_kindermax")/1000)) {
        kinder_1_fyn = 0
      }
      else if (parseInt(sliderKinder.value) < (feature.get("_kindermax")/1000)) {
        kinder_1_fyn = (sliderKinder.value - (feature.get("_kindermin")/1000)) / ((feature.get("_kindermax") - feature.get("_kindermin"))/1000)
        if (kinder_1_fyn < 0) {
          kinder_1_fyn = 0;
        }
        else if (kinder_1_fyn <= 100) {
        }
      }
    if (parseInt(sliderIndustry.value) > (feature.get("_industr_2")/1000)) {
      industries_1_fyn = 0;}
      else if (parseInt(sliderIndustry.value) == (feature.get("_industr_2")/1000)) {
        industries_1_fyn = 0
      }
      else if (parseInt(sliderIndustry.value) < (feature.get("_industr_2")/1000)) {
        industries_1_fyn = (sliderIndustry.value - (feature.get("_industr_1")/1000)) / ((feature.get("_industr_2") - feature.get("_industr_1"))/1000)
        if (industries_1_fyn < 0) {
          industries_1_fyn = 0;
        }
        else if (industries_1_fyn <= 100) {
        }
      }
    if (parseInt(sliderHprice.value) > feature.get("housepri_3")) {
      houseprice_1_fyn = 0;}
      else if (parseInt(sliderHprice.value) == feature.get("housepri_3")) {
        houseprice_1_fyn = 0
      }
      else if (parseInt(sliderHprice.value) < feature.get("housepri_3")) {
        houseprice_1_fyn = ((sliderHprice.value - feature.get("housepri_2")) / (feature.get("housepri_3") - feature.get("housepri_2")))
        if (houseprice_1_fyn < 0) {
          houseprice_1_fyn = 0;
        }
        else if (houseprice_1_fyn <= 100) {
        }
      }
    if (parseInt(sliderWater.value) > feature.get("_waterbo_2")) {
      water_1_fyn = 0;}
      else if (parseInt(sliderWater.value) == feature.get("_waterbo_2")) {
        water_1_fyn = 0
      }
      else if (parseInt(sliderWater.value) < feature.get("_waterbo_2")) {
        water_1_fyn = ((sliderWater.value - feature.get("_waterbo_1")) / (feature.get("_waterbo_2") - feature.get("_waterbo_1")))
        if (water_1_fyn < 0) {
          water_1_fyn = 0;
        }
        else if (water_1_fyn <= 100) {
        }
      }
    new_fuzzy_value_1km_fyn = (coasts_1_fyn + hospitals_1_fyn + parks_1_fyn + roads_1_fyn + schools_1_fyn + markets_1_fyn + uni_1_fyn + stops_1_fyn + stations_1_fyn + restuarants_1_fyn + theatres_1_fyn + cinemas_1_fyn + kinder_1_fyn + industries_1_fyn + houseprice_1_fyn)/16;
    feature.set("fuzzyvalue", new_fuzzy_value_1km_fyn);
    accessibility_1_fyn = (((roads_1_fyn + stops_1_fyn + stations_1_fyn) / 3) * 100);
    livability_1_fyn = (((uni_1_fyn + schools_1_fyn + kinder_1_fyn + coasts_1_fyn + markets_1_fyn + water_1_fyn + industries_1_fyn + hospitals_1_fyn + restuarants_1_fyn + theatres_1_fyn + cinemas_1_fyn + parks_1_fyn) / 12) * 100);
    suitability_1_fyn = (((houseprice_1_fyn) / 1) * 100);
    feature.set("accessibility", accessibility_1_fyn);
    feature.set("livability", livability_1_fyn);
    feature.set("suitability", suitability_1_fyn);
  });

  // Calculate Weights for 1km Grid - Midtjylland
  var source_1km_midtjylland = grid1km_vectorimage_midtjylland.getSource();
  var features_1km_midtjylland = source_1km_midtjylland.getFeatures();
  var coasts_1_midtjylland;
  var hospitals_1_midtjylland;
  var parks_1_midtjylland;
  var roads_1_midtjylland;
  var schools_1_midtjylland;
  var markets_1_midtjylland;
  var uni_1_midtjylland;
  var stops_1_midtjylland;
  var stations_1_midtjylland;
  var restuarants_1_midtjylland;
  var theatres_1_midtjylland;
  var cinemas_1_midtjylland;
  var kinder_1_midtjylland;
  var industries_1_midtjylland;
  var houseprice_1_midtjylland;
  var water_1_midtjylland;
  var new_fuzzy_value_1km_midtjylland;
  var accessibility_1_midtjylland;
  var livability_1_midtjylland;
  var suitability_1_midtjylland;

  features_1km_midtjylland.forEach(function(feature){
    if (parseInt(sliderUni.value) > (feature.get("_univers_2")/1000)) {
      uni_1_midtjylland = 0}
      else if (parseInt(sliderUni.value) == (feature.get("_univers_2")/1000)) {
        uni_1_midtjylland = 0
      }
      else if (parseInt(sliderUni.value) < (feature.get("_univers_2")/1000)) {
        uni_1_midtjylland = (sliderUni.value - (feature.get("_univers_1")/1000)) / ((feature.get("_univers_2") - feature.get("_univers_1"))/1000)
        if (uni_1_midtjylland < 0) {
          uni_1_midtjylland = 0;
        }
        else if (uni_1_midtjylland <= 100) {
        }
      }
    if (parseInt(sliderRoads.value) > (feature.get("_roadsmax")/1000)) {
      roads_1_midtjylland = 0;}
      else if (parseInt(sliderRoads.value) == (feature.get("_roadsmax")/1000)) {
        roads_1_midtjylland = 0
      }
      else if (parseInt(sliderRoads.value) < (feature.get("_roadsmax")/1000)) {
        roads_1_midtjylland = (sliderRoads.value - (feature.get("_roadsmin")/1000)) / ((feature.get("_roadsmax") - feature.get("_roadsmin"))/1000)
        if (roads_1_midtjylland < 0) {
          roads_1_midtjylland = 0;
        }
        else if (roads_1_midtjylland <= 100) {
        }
      }
    if (parseInt(sliderCoasts.value) > (feature.get("_coastli_2")/1000)) {
      coasts_1_midtjylland = 0;}
      else if (parseInt(sliderCoasts.value) == (feature.get("_coastli_2")/1000)) {
        coasts_1_midtjylland = 0
      }
      else if (parseInt(sliderCoasts.value) < (feature.get("_coastli_2")/1000)) {
        coasts_1_midtjylland = (sliderCoasts.value - (feature.get("_coastli_1")/1000)) / ((feature.get("_coastli_2") - feature.get("_coastli_1"))/1000)
        if (coasts_1_midtjylland < 0) {
          coasts_1_midtjylland = 0;
        }
        else if (coasts_1_midtjylland <= 100) {
        }
      }
    if (parseInt(sliderHospitals.value) > (feature.get("_hospita_2")/1000)) {
      hospitals_1_midtjylland = 0;}
      else if (parseInt(sliderHospitals.value) == (feature.get("_hospita_2")/1000)) {
        hospitals_1_midtjylland = 0
      }
      else if (parseInt(sliderHospitals.value) < (feature.get("_hospita_2")/1000)) {
        hospitals_1_midtjylland = (sliderHospitals.value - (feature.get("_hospita_1")/1000)) / ((feature.get("_hospita_2") - feature.get("_hospita_1"))/1000)
        if (hospitals_1_midtjylland < 0) {
          hospitals_1_midtjylland = 0;
        }
        else if (hospitals_1_midtjylland <= 100) {
        }
      }
    if (parseInt(sliderParks.value) > (feature.get("_leisure_2")/1000)) {
      parks_1_midtjylland = 0;}
      else if (parseInt(sliderParks.value) == (feature.get("_leisure_2")/1000)) {
        parks_1_midtjylland = 0
      }
      else if (parseInt(sliderParks.value) < (feature.get("_leisure_2")/1000)) {
        parks_1_midtjylland = (sliderParks.value - (feature.get("_leisure_1")/1000)) / ((feature.get("_leisure_2") - feature.get("_leisure_1"))/1000)
        if (parks_1_midtjylland < 0) {
          parks_1_midtjylland = 0;
        }
        else if (parks_1_midtjylland <= 100) {
        }
      }
    if (parseInt(sliderSchools.value) > (feature.get("_schoolsma")/1000)) {
      schools_1_midtjylland = 0;}
      else if (parseInt(sliderSchools.value) == (feature.get("_schoolsma")/1000)) {
        schools_1_midtjylland = 0
      }
      else if (parseInt(sliderSchools.value) < (feature.get("_schoolsma")/1000)) {
        schools_1_midtjylland = (sliderSchools.value - (feature.get("_schoolsmi")/1000)) / ((feature.get("_schoolsma") - feature.get("_schoolsmi"))/1000)
        if (schools_1_midtjylland < 0) {
          schools_1_midtjylland = 0;
        }
        else if (schools_1_midtjylland <= 100) {
        }
      }
    if (parseInt(sliderMarkets.value) > (feature.get("_superma_2")/1000)) {
      markets_1_midtjylland = 0;}
      else if (parseInt(sliderMarkets.value) == (feature.get("_superma_2")/1000)) {
        markets_1_midtjylland = 0
      }
      else if (parseInt(sliderMarkets.value) < (feature.get("_superma_2")/1000)) {
        markets_1_midtjylland = (sliderMarkets.value - (feature.get("_superma_1")/1000)) / ((feature.get("_superma_2") - feature.get("_superma_1"))/1000)
        if (markets_1_midtjylland < 0) {
          markets_1_midtjylland = 0;
        }
        else if (markets_1_midtjylland <= 100) {
        }
      }
    if (parseInt(sliderPstops.value) > (feature.get("_pt_stop_2")/1000)) {
      stops_1_midtjylland = 0;}
      else if (parseInt(sliderPstops.value) == (feature.get("_pt_stop_2")/1000)) {
        stops_1_midtjylland = 0
      }
      else if (parseInt(sliderPstops.value) < (feature.get("_pt_stop_2")/1000)) {
        stops_1_midtjylland = (sliderPstops.value - (feature.get("_pt_stop_1")/1000)) / ((feature.get("_pt_stop_2") - feature.get("_pt_stop_1"))/1000)
        if (stops_1_midtjylland < 0) {
          stops_1_midtjylland = 0;
        }
        else if (stops_1_midtjylland <= 100) {
        }
      }
    if (parseInt(sliderPstations.value) > (feature.get("_pt_stat_2")/1000)) {
      stations_1_midtjylland = 0;}
      else if (parseInt(sliderPstations.value) == (feature.get("_pt_stat_2")/1000)) {
        stations_1_midtjylland = 0
      }
      else if (parseInt(sliderPstations.value) < (feature.get("_pt_stat_2")/1000)) {
        stations_1_midtjylland = (sliderPstations.value - (feature.get("_pt_stat_1")/1000)) / ((feature.get("_pt_stat_2") - feature.get("_pt_stat_1"))/1000)
        if (stations_1_midtjylland < 0) {
          stations_1_midtjylland = 0;
        }
        else if (stations_1_midtjylland <= 100) {
        }
      }
    if (parseInt(sliderRestuarants.value) > (feature.get("_restaur_2")/1000)) {
      restuarants_1_midtjylland = 0;}
      else if (parseInt(sliderRestuarants.value) == (feature.get("_restaur_2")/1000)) {
        restuarants_1_midtjylland = 0
      }
      else if (parseInt(sliderRestuarants.value) < (feature.get("_restaur_2")/1000)) {
        restuarants_1_midtjylland = (sliderRestuarants.value - (feature.get("_restaur_1")/1000)) / ((feature.get("_restaur_2") - feature.get("_restaur_1"))/1000)
        if (restuarants_1_midtjylland < 0) {
          restuarants_1_midtjylland = 0;
        }
        else if (restuarants_1_midtjylland <= 100) {
        }
      }
    if (parseInt(sliderTheatres.value) > (feature.get("_theatre_2")/1000)) {
      theatres_1_midtjylland = 0;}
      else if (parseInt(sliderTheatres.value) == (feature.get("_theatre_2")/1000)) {
        theatres_1_midtjylland = 0
      }
      else if (parseInt(sliderTheatres.value) < (feature.get("_theatre_2")/1000)) {
        theatres_1_midtjylland = (sliderTheatres.value - (feature.get("_theatre_1")/1000)) / ((feature.get("_theatre_2") - feature.get("_theatre_1"))/1000)
        if (theatres_1_midtjylland < 0) {
          theatres_1_midtjylland = 0;
        }
        else if (theatres_1_midtjylland <= 100) {
        }
      }
    if (parseInt(sliderCinemas.value) > (feature.get("_cinemasma")/1000)) {
      cinemas_1_midtjylland = 0;}
      else if (parseInt(sliderCinemas.value) == (feature.get("_cinemasma")/1000)) {
        cinemas_1_midtjylland = 0
      }
      else if (parseInt(sliderCinemas.value) < (feature.get("_cinemasma")/1000)) {
        cinemas_1_midtjylland = (sliderCinemas.value - (feature.get("_cinemasmi")/1000)) / ((feature.get("_cinemasma") - feature.get("_cinemasmi"))/1000)
        if (cinemas_1_midtjylland < 0) {
          cinemas_1_midtjylland = 0;
        }
        else if (cinemas_1_midtjylland <= 100) {
        }
      }
    if (parseInt(sliderKinder.value) > (feature.get("_kindermax")/1000)) {
      kinder_1_midtjylland = 0;}
      else if (parseInt(sliderKinder.value) == (feature.get("_kindermax")/1000)) {
        kinder_1_midtjylland = 0
      }
      else if (parseInt(sliderKinder.value) < (feature.get("_kindermax")/1000)) {
        kinder_1_midtjylland = (sliderKinder.value - (feature.get("_kindermin")/1000)) / ((feature.get("_kindermax") - feature.get("_kindermin"))/1000)
        if (kinder_1_midtjylland < 0) {
          kinder_1_midtjylland = 0;
        }
        else if (kinder_1_midtjylland <= 100) {
        }
      }
    if (parseInt(sliderIndustry.value) > (feature.get("_industr_2")/1000)) {
      industries_1_midtjylland = 0;}
      else if (parseInt(sliderIndustry.value) == (feature.get("_industr_2")/1000)) {
        industries_1_midtjylland = 0
      }
      else if (parseInt(sliderIndustry.value) < (feature.get("_industr_2")/1000)) {
        industries_1_midtjylland = (sliderIndustry.value - (feature.get("_industr_1")/1000)) / ((feature.get("_industr_2") - feature.get("_industr_1"))/1000)
        if (industries_1_midtjylland < 0) {
          industries_1_midtjylland = 0;
        }
        else if (industries_1_midtjylland <= 100) {
        }
      }
    if (parseInt(sliderHprice.value) > feature.get("housepri_3")) {
      houseprice_1_midtjylland = 0;}
      else if (parseInt(sliderHprice.value) == feature.get("housepri_3")) {
        houseprice_1_midtjylland = 0
      }
      else if (parseInt(sliderHprice.value) < feature.get("housepri_3")) {
        houseprice_1_midtjylland = ((sliderHprice.value - feature.get("housepri_2")) / (feature.get("housepri_3") - feature.get("housepri_2")))
        if (houseprice_1_midtjylland < 0) {
          houseprice_1_midtjylland = 0;
        }
        else if (houseprice_1_midtjylland <= 100) {
        }
      }
    if (parseInt(sliderWater.value) > feature.get("_waterbo_2")) {
      water_1_midtjylland = 0;}
      else if (parseInt(sliderWater.value) == feature.get("_waterbo_2")) {
        water_1_midtjylland = 0
      }
      else if (parseInt(sliderWater.value) < feature.get("_waterbo_2")) {
        water_1_midtjylland = ((sliderWater.value - feature.get("_waterbo_1")) / (feature.get("_waterbo_2") - feature.get("_waterbo_1")))
        if (water_1_midtjylland < 0) {
          water_1_midtjylland = 0;
        }
        else if (water_1_midtjylland <= 100) {
        }
      }
    new_fuzzy_value_1km_midtjylland = (coasts_1_midtjylland + hospitals_1_midtjylland + parks_1_midtjylland + roads_1_midtjylland + schools_1_midtjylland + markets_1_midtjylland + uni_1_midtjylland + stops_1_midtjylland + stations_1_midtjylland + restuarants_1_midtjylland + theatres_1_midtjylland + cinemas_1_midtjylland + kinder_1_midtjylland + industries_1_midtjylland + houseprice_1_midtjylland)/16;
    feature.set("fuzzyvalue", new_fuzzy_value_1km_midtjylland);
    accessibility_1_midtjylland = (((roads_1_midtjylland + stops_1_midtjylland + stations_1_midtjylland) / 3) * 100);
    livability_1_midtjylland = (((uni_1_midtjylland + schools_1_midtjylland + kinder_1_midtjylland + coasts_1_midtjylland + markets_1_midtjylland + water_1_midtjylland + industries_1_midtjylland + hospitals_1_midtjylland + restuarants_1_midtjylland + theatres_1_midtjylland + cinemas_1_midtjylland + parks_1_midtjylland) / 12) * 100);
    suitability_1_midtjylland = (((houseprice_1_midtjylland) / 1) * 100);
    feature.set("accessibility", accessibility_1_midtjylland);
    feature.set("livability", livability_1_midtjylland);
    feature.set("suitability", suitability_1_midtjylland);
  });

  // Calculate Weights for 1km Grid - Midtjylland West
  var source_1km_midtjyllandw = grid1km_vectorimage_midtjyllandw.getSource();
  var features_1km_midtjyllandw = source_1km_midtjyllandw.getFeatures();

  var coasts_1_midtjyllandw;
  var hospitals_1_midtjyllandw;
  var parks_1_midtjyllandw;
  var roads_1_midtjyllandw;
  var schools_1_midtjyllandw;
  var markets_1_midtjyllandw;
  var uni_1_midtjyllandw;
  var stops_1_midtjyllandw;
  var stations_1_midtjyllandw;
  var restuarants_1_midtjyllandw;
  var theatres_1_midtjyllandw;
  var cinemas_1_midtjyllandw;
  var kinder_1_midtjyllandw;
  var industries_1_midtjyllandw;
  var houseprice_1_midtjyllandw;
  var water_1_midtjyllandw;
  var new_fuzzy_value_1km_midtjyllandw;
  var accessibility_1_midtjyllandw;
  var livability_1_midtjyllandw;
  var suitability_1_midtjyllandw;


  features_1km_midtjyllandw.forEach(function(feature){
    if (parseInt(sliderUni.value) > (feature.get("_univers_2")/1000)) {
      uni_1_midtjyllandw = 0}
      else if (parseInt(sliderUni.value) == (feature.get("_univers_2")/1000)) {
        uni_1_midtjyllandw = 0
      }
      else if (parseInt(sliderUni.value) < (feature.get("_univers_2")/1000)) {
        uni_1_midtjyllandw = (sliderUni.value - (feature.get("_univers_1")/1000)) / ((feature.get("_univers_2") - feature.get("_univers_1"))/1000)
        if (uni_1_midtjyllandw < 0) {
          uni_1_midtjyllandw = 0;
        }
        else if (uni_1_midtjyllandw <= 100) {
        }
      }
    if (parseInt(sliderRoads.value) > (feature.get("_roadsmax")/1000)) {
      roads_1_midtjyllandw = 0;}
      else if (parseInt(sliderRoads.value) == (feature.get("_roadsmax")/1000)) {
        roads_1_midtjyllandw = 0
      }
      else if (parseInt(sliderRoads.value) < (feature.get("_roadsmax")/1000)) {
        roads_1_midtjyllandw = (sliderRoads.value - (feature.get("_roadsmin")/1000)) / ((feature.get("_roadsmax") - feature.get("_roadsmin"))/1000)
        if (roads_1_midtjyllandw < 0) {
          roads_1_midtjyllandw = 0;
        }
        else if (roads_1_midtjyllandw <= 100) {
        }
      }
    if (parseInt(sliderCoasts.value) > (feature.get("_coastli_2")/1000)) {
      coasts_1_midtjyllandw = 0;}
      else if (parseInt(sliderCoasts.value) == (feature.get("_coastli_2")/1000)) {
        coasts_1_midtjyllandw = 0
      }
      else if (parseInt(sliderCoasts.value) < (feature.get("_coastli_2")/1000)) {
        coasts_1_midtjyllandw = (sliderCoasts.value - (feature.get("_coastli_1")/1000)) / ((feature.get("_coastli_2") - feature.get("_coastli_1"))/1000)
        if (coasts_1_midtjyllandw < 0) {
          coasts_1_midtjyllandw = 0;
        }
        else if (coasts_1_midtjyllandw <= 100) {
        }
      }
    if (parseInt(sliderHospitals.value) > (feature.get("_hospita_2")/1000)) {
      hospitals_1_midtjyllandw = 0;}
      else if (parseInt(sliderHospitals.value) == (feature.get("_hospita_2")/1000)) {
        hospitals_1_midtjyllandw = 0
      }
      else if (parseInt(sliderHospitals.value) < (feature.get("_hospita_2")/1000)) {
        hospitals_1_midtjyllandw = (sliderHospitals.value - (feature.get("_hospita_1")/1000)) / ((feature.get("_hospita_2") - feature.get("_hospita_1"))/1000)
        if (hospitals_1_midtjyllandw < 0) {
          hospitals_1_midtjyllandw = 0;
        }
        else if (hospitals_1_midtjyllandw <= 100) {
        }
      }
    if (parseInt(sliderParks.value) > (feature.get("_leisure_2")/1000)) {
      parks_1_midtjyllandw = 0;}
      else if (parseInt(sliderParks.value) == (feature.get("_leisure_2")/1000)) {
        parks_1_midtjyllandw = 0
      }
      else if (parseInt(sliderParks.value) < (feature.get("_leisure_2")/1000)) {
        parks_1_midtjyllandw = (sliderParks.value - (feature.get("_leisure_1")/1000)) / ((feature.get("_leisure_2") - feature.get("_leisure_1"))/1000)
        if (parks_1_midtjyllandw < 0) {
          parks_1_midtjyllandw = 0;
        }
        else if (parks_1_midtjyllandw <= 100) {
        }
      }
    if (parseInt(sliderSchools.value) > (feature.get("_schoolsma")/1000)) {
      schools_1_midtjyllandw = 0;}
      else if (parseInt(sliderSchools.value) == (feature.get("_schoolsma")/1000)) {
        schools_1_midtjyllandw = 0
      }
      else if (parseInt(sliderSchools.value) < (feature.get("_schoolsma")/1000)) {
        schools_1_midtjyllandw = (sliderSchools.value - (feature.get("_schoolsmi")/1000)) / ((feature.get("_schoolsma") - feature.get("_schoolsmi"))/1000)
        if (schools_1_midtjyllandw < 0) {
          schools_1_midtjyllandw = 0;
        }
        else if (schools_1_midtjyllandw <= 100) {
        }
      }
    if (parseInt(sliderMarkets.value) > (feature.get("_superma_2")/1000)) {
      markets_1_midtjyllandw = 0;}
      else if (parseInt(sliderMarkets.value) == (feature.get("_superma_2")/1000)) {
        markets_1_midtjyllandw = 0
      }
      else if (parseInt(sliderMarkets.value) < (feature.get("_superma_2")/1000)) {
        markets_1_midtjyllandw = (sliderMarkets.value - (feature.get("_superma_1")/1000)) / ((feature.get("_superma_2") - feature.get("_superma_1"))/1000)
        if (markets_1_midtjyllandw < 0) {
          markets_1_midtjyllandw = 0;
        }
        else if (markets_1_midtjyllandw <= 100) {
        }
      }
    if (parseInt(sliderPstops.value) > (feature.get("_pt_stop_2")/1000)) {
      stops_1_midtjyllandw = 0;}
      else if (parseInt(sliderPstops.value) == (feature.get("_pt_stop_2")/1000)) {
        stops_1_midtjyllandw = 0
      }
      else if (parseInt(sliderPstops.value) < (feature.get("_pt_stop_2")/1000)) {
        stops_1_midtjyllandw = (sliderPstops.value - (feature.get("_pt_stop_1")/1000)) / ((feature.get("_pt_stop_2") - feature.get("_pt_stop_1"))/1000)
        if (stops_1_midtjyllandw < 0) {
          stops_1_midtjyllandw = 0;
        }
        else if (stops_1_midtjyllandw <= 100) {
        }
      }
    if (parseInt(sliderPstations.value) > (feature.get("_pt_stat_2")/1000)) {
      stations_1_midtjyllandw = 0;}
      else if (parseInt(sliderPstations.value) == (feature.get("_pt_stat_2")/1000)) {
        stations_1_midtjyllandw = 0
      }
      else if (parseInt(sliderPstations.value) < (feature.get("_pt_stat_2")/1000)) {
        stations_1_midtjyllandw = (sliderPstations.value - (feature.get("_pt_stat_1")/1000)) / ((feature.get("_pt_stat_2") - feature.get("_pt_stat_1"))/1000)
        if (stations_1_midtjyllandw < 0) {
          stations_1_midtjyllandw = 0;
        }
        else if (stations_1_midtjyllandw <= 100) {
        }
      }
    if (parseInt(sliderRestuarants.value) > (feature.get("_restaur_2")/1000)) {
      restuarants_1_midtjyllandw = 0;}
      else if (parseInt(sliderRestuarants.value) == (feature.get("_restaur_2")/1000)) {
        restuarants_1_midtjyllandw = 0
      }
      else if (parseInt(sliderRestuarants.value) < (feature.get("_restaur_2")/1000)) {
        restuarants_1_midtjyllandw = (sliderRestuarants.value - (feature.get("_restaur_1")/1000)) / ((feature.get("_restaur_2") - feature.get("_restaur_1"))/1000)
        if (restuarants_1_midtjyllandw < 0) {
          restuarants_1_midtjyllandw = 0;
        }
        else if (restuarants_1_midtjyllandw <= 100) {
        }
      }
    if (parseInt(sliderTheatres.value) > (feature.get("_theatre_2")/1000)) {
      theatres_1_midtjyllandw = 0;}
      else if (parseInt(sliderTheatres.value) == (feature.get("_theatre_2")/1000)) {
        theatres_1_midtjyllandw = 0
      }
      else if (parseInt(sliderTheatres.value) < (feature.get("_theatre_2")/1000)) {
        theatres_1_midtjyllandw = (sliderTheatres.value - (feature.get("_theatre_1")/1000)) / ((feature.get("_theatre_2") - feature.get("_theatre_1"))/1000)
        if (theatres_1_midtjyllandw < 0) {
          theatres_1_midtjyllandw = 0;
        }
        else if (theatres_1_midtjyllandw <= 100) {
        }
      }
    if (parseInt(sliderCinemas.value) > (feature.get("_cinemasma")/1000)) {
      cinemas_1_midtjyllandw = 0;}
      else if (parseInt(sliderCinemas.value) == (feature.get("_cinemasma")/1000)) {
        cinemas_1_midtjyllandw = 0
      }
      else if (parseInt(sliderCinemas.value) < (feature.get("_cinemasma")/1000)) {
        cinemas_1_midtjyllandw = (sliderCinemas.value - (feature.get("_cinemasmi")/1000)) / ((feature.get("_cinemasma") - feature.get("_cinemasmi"))/1000)
        if (cinemas_1_midtjyllandw < 0) {
          cinemas_1_midtjyllandw = 0;
        }
        else if (cinemas_1_midtjyllandw <= 100) {
        }
      }
    if (parseInt(sliderKinder.value) > (feature.get("_kindermax")/1000)) {
      kinder_1_midtjyllandw = 0;}
      else if (parseInt(sliderKinder.value) == (feature.get("_kindermax")/1000)) {
        kinder_1_midtjyllandw = 0
      }
      else if (parseInt(sliderKinder.value) < (feature.get("_kindermax")/1000)) {
        kinder_1_midtjyllandw = (sliderKinder.value - (feature.get("_kindermin")/1000)) / ((feature.get("_kindermax") - feature.get("_kindermin"))/1000)
        if (kinder_1_midtjyllandw < 0) {
          kinder_1_midtjyllandw = 0;
        }
        else if (kinder_1_midtjyllandw <= 100) {
        }
      }
    if (parseInt(sliderIndustry.value) > (feature.get("_industr_2")/1000)) {
      industries_1_midtjyllandw = 0;}
      else if (parseInt(sliderIndustry.value) == (feature.get("_industr_2")/1000)) {
        industries_1_midtjyllandw = 0
      }
      else if (parseInt(sliderIndustry.value) < (feature.get("_industr_2")/1000)) {
        industries_1_midtjyllandw = (sliderIndustry.value - (feature.get("_industr_1")/1000)) / ((feature.get("_industr_2") - feature.get("_industr_1"))/1000)
        if (industries_1_midtjyllandw < 0) {
          industries_1_midtjyllandw = 0;
        }
        else if (industries_1_midtjyllandw <= 100) {
        }
      }
    if (parseInt(sliderHprice.value) > feature.get("housepri_3")) {
      houseprice_1_midtjyllandw = 0;}
      else if (parseInt(sliderHprice.value) == feature.get("housepri_3")) {
        houseprice_1_midtjyllandw = 0
      }
      else if (parseInt(sliderHprice.value) < feature.get("housepri_3")) {
        houseprice_1_midtjyllandw = ((sliderHprice.value - feature.get("housepri_2")) / (feature.get("housepri_3") - feature.get("housepri_2")))
        if (houseprice_1_midtjyllandw < 0) {
          houseprice_1_midtjyllandw = 0;
        }
        else if (houseprice_1_midtjyllandw <= 100) {
        }
      }
    if (parseInt(sliderWater.value) > feature.get("_waterbo_2")) {
      water_1_midtjyllandw = 0;}
      else if (parseInt(sliderWater.value) == feature.get("_waterbo_2")) {
        water_1_midtjyllandw = 0
      }
      else if (parseInt(sliderWater.value) < feature.get("_waterbo_2")) {
        water_1_midtjyllandw = ((sliderWater.value - feature.get("_waterbo_1")) / (feature.get("_waterbo_2") - feature.get("_waterbo_1")))
        if (water_1_midtjyllandw < 0) {
          water_1_midtjyllandw = 0;
        }
        else if (water_1_midtjyllandw <= 100) {
        }
      }
    new_fuzzy_value_1km_midtjyllandw = (coasts_1_midtjyllandw + hospitals_1_midtjyllandw + parks_1_midtjyllandw + roads_1_midtjyllandw + schools_1_midtjyllandw + markets_1_midtjyllandw + uni_1_midtjyllandw + stops_1_midtjyllandw + stations_1_midtjyllandw + restuarants_1_midtjyllandw + theatres_1_midtjyllandw + cinemas_1_midtjyllandw + kinder_1_midtjyllandw + industries_1_midtjyllandw + houseprice_1_midtjyllandw)/16;
    feature.set("fuzzyvalue", new_fuzzy_value_1km_midtjyllandw);
    accessibility_1_midtjyllandw = (((roads_1_midtjyllandw + stops_1_midtjyllandw + stations_1_midtjyllandw) / 3) * 100);
    livability_1_midtjyllandw = (((uni_1_midtjyllandw + schools_1_midtjyllandw + kinder_1_midtjyllandw + coasts_1_midtjyllandw + markets_1_midtjyllandw + water_1_midtjyllandw + industries_1_midtjyllandw + hospitals_1_midtjyllandw + restuarants_1_midtjyllandw + theatres_1_midtjyllandw + cinemas_1_midtjyllandw + parks_1_midtjyllandw) / 12) * 100);
    suitability_1_midtjyllandw = (((houseprice_1_midtjyllandw) / 1) * 100);
    feature.set("accessibility", accessibility_1_midtjyllandw);
    feature.set("livability", livability_1_midtjyllandw);
    feature.set("suitability", suitability_1_midtjyllandw);
  });


  //Calculate Weights for 100km Grid- MARCIA

  var source_100km = grid100km.getSource();
  var features_100km = source_100km.getFeatures();
  var uni_matchmax ;
  var uni_matchmin ;
  var uni_matchdiff ;
  var cell_int_u ;
  var uni_match_perc ;
  var sch_matchmax ;
  var sch_matchmin ;
  var sch_matchdiff ;
  var cell_int_sch ;
  var sch_match_perc ; 
  var coast_matchmax ;
  var coast_matchmin ;
  var coast_matchdiff ;
  var cell_int_coast ;
  var coast_match_perc ;
  var hos_matchmax ;
  var hos_matchmin ;
  var hos_matchdiff ;
  var cell_int_hos ;
  var hos_match_perc ;
  var parks_matchmax ;
  var parks_matchmin ;
  var parks_matchdiff ;
  var cell_int_parks ;
  var parks_match_perc ;
  var roads_matchmax ;
  var roads_matchmin ;
  var roads_matchdiff ;
  var cell_int_roads ;
  var roads_match_perc ;
  var markets_matchmax ;
  var markets_matchmin ;
  var markets_matchdiff ;
  var cell_int_markets ;
  var markets_match_perc ;
  var house_matchmax ;
  var house_matchmin ;
  var house_matchdiff ;
  var cell_int_house ;
  var house_match_perc ;

  var ptst_matchmax ;
  var ptst_matchmin ;
  var ptst_matchdiff ;
  var cell_int_ptst ;
  var ptst_match_perc ;

  var ptsta_matchmax ;
  var ptsta_matchmin ;
  var ptsta_matchdiff ;
  var cell_int_ptsta ;
  var ptsta_match_perc ;

  var resto_matchmax ;
  var resto_matchmin ;
  var resto_matchdiff ;
  var cell_int_resto ;
  var resto_match_perc ;

  var accessibility_100;
  var suitability_100;
  var livability_100;
  var new_fuzzy_value_100km;
  
   
  // MATCH PERCENTAGE FOR UNIVERSITIES
  features_100km.forEach(function(feature ){
    var grid100_id = feature.get("id");
    // When user input doesn't match cell range
    if ((feature.get("_univers_1")/1000) > parseInt(sliderUni.value)) {
      uni_matchmax = 0; 
      uni_matchmin = 0; 
      console.log(grid100_id + ": Cell min larger than Uni slider");
    }
      else if (parseInt(sliderUni.value) == (feature.get("_univers_1")/1000)) {
        uni_matchmax = 0;
        uni_matchmin = 0;
        console.log (grid100_id + ": Cell min equal to Uni slider");
      }
    
      // Getting the maximum matching distance value
      else if ((feature.get("_univers_2")/1000) == parseInt(sliderUni.value)) {
        uni_matchmax = (feature.get("_univers_2")/1000);
        console.log(grid100_id + ": Cell max equal to Uni slider");
      }
      else if (( feature.get("_univers_2")/1000) > parseInt(sliderUni.value)) {
        uni_matchmax = parseInt(sliderUni.value);
        console.log(grid100_id + ": Cell max greater than Uni slider");
      }
      else if ((feature.get("_univers_2")/1000) < parseInt(sliderUni.value)) {
        uni_matchmax = (feature.get("_univers_2")/1000);
        console.log(grid100_id + ": Cell max smaller than Uni slider");
      }
    
      // Getting the minimum matching distance value
      else if ((feature.get("_univers_1")/1000) == 0) {
        uni_matchmin = 0;
        console.log(grid100_id + ": Cell min equal to 1.");
      }
      else if ((feature.get("_univers_1") /1000 > 0)) {
        uni_matchmin = (feature.get("_univers_1")/1000);
        console.log(grid100_id + ": Minimum user slider (0) smaller than cell min.");
      }

    // MATCH PERCENTAGE FOR SCHOOLS
    // When user input doesn 't match cell range
    if ((feature.get("_schoolsmi")/1000) > parseInt(sliderSchools.value)) {
        sch_matchmax = 0;
        sch_matchmin = 0;
        console.log(grid100_id + ": School min larger than slider");
    }
      else if (parseInt(sliderSchools.value) == (feature.get("_schoolsmi")/1000)) {
        sch_matchmax = 0;
        sch_matchmin = 0;
        console.log(grid100_id + ": School min value equal to slider max");
      }
      // Getting the maximum matching distance value
      else if ((feature.get("_schoolsma")/1000) == parseInt(sliderSchools.value)) {
        sch_matchmax = (feature.get("_schoolsma")/1000);
        console.log(grid100_id + ": School max value equal to slider max");
      }
      else if ((feature.get("_schoolsma")/1000) > parseInt(sliderSchools.value)) {
        sch_matchmax = parseInt(sliderSchools.value);
        console.log(grid100_id + ": School max value greater than slider max");
      }
      else if ((feature.get("_schoolsma")/1000) < parseInt(sliderSchools.value)) {
        sch_matchmax = (feature.get("_schoolsma")/1000);
        console.log(grid100_id + ": School max value smaller than slider max");
      }
      
      // Getting the minimum matching distance value
      else if ((feature.get("_schoolsmi")/1000) == 0) {
        sch_matchmin = 0;
        console.log(grid100_id + ": School min value equal to 1");
      }
      else if ((feature.get("_schoolsmi")/1000 > 0)) {
        sch_matchmin = (feature.get("_schoolsmi")/1000);
        console.log(grid100_id + ": School slider value smaller than min value");
      }

      // MATCH PERCENTAGE FOR COASTLINE
      // When user input doesn 't match cell range
      if ((feature.get("_coastli_1")/1000) > parseInt(sliderCoasts.value)) {
        coast_matchmax = 0;
        coast_matchmin = 0;
        console.log(grid100_id + ": Coast min larger than slider max");
      }
        else if (parseInt(sliderCoasts.value) == (feature.get("_coastli_1")/1000)) {
          coast_matchmax = 0;
          coast_matchmin = 0;
          console.log(grid100_id + ": Coast min value equal to slider max");
        }
        
        // Getting the maximum matching distance value
        else if ((feature.get("_coastli_2")/1000) == parseInt(sliderCoasts.value)) {
          coast_matchmax = (feature.get("_coastli_2")/1000);
          console.log(grid100_id + ": Coast max value equal to slider max");
        }
        else if ((feature.get("_coastli_2")/1000) > parseInt(sliderSchools.value)) {
          coast_matchmax = parseInt(sliderCoasts.value);
          console.log(grid100_id + ": Coast max value greater than slider max");
        }
        else if ((feature.get("_coastli_2")/1000) < parseInt(sliderCoasts.value)) {
          coast_matchmax = (feature.get("_coastli_2")/1000);
          console.log(grid100_id + ": Coast max value smaller than slider max");
        }
        
        // Getting the minimum matching distance value
        else if ((feature.get("_coastli_1")/1000) == 0) {
          coast_matchmin = 0;
          console.log(grid100_id + ": Coast min value equal to 1");
        }
        else if ((feature.get("_coastli_1")/1000 > 0)) {
          coast_matchmin = (feature.get("_coastli_1")/1000);
          console.log(grid100_id + ": Coast user slider smaller than cell value");
        }
  
    // MATCH PERCENTAGE FOR HOSPITALS
    // When user input doesn 't match cell range
    if ((feature.get("_hospita_1")/1000) > parseInt(sliderHospitals.value)) {
      hos_matchmax = 0;
      hos_matchmin = 0;
      console.log(grid100_id + ": Hospital min value larger than slider max");
    }
      else if (parseInt(sliderHospitals.value) == (feature.get("_hospita_1")/1000)) {
        hos_matchmax = 0;
        hos_matchmin = 0;
        console.log(grid100_id + ": Hospital min value equal to slider max");
      }
      
      // Getting the maximum matching distance value
      else if ((feature.get("_hospita_2")/1000) == parseInt(sliderHospitals.value)) {
        hos_matchmax = (feature.get("_hospita_2")/1000);
        console.log(grid100_id + ": Hospital max value equal to slider max");
      }
      else if ((feature.get("_hospita_2")/1000) > parseInt(sliderHospitals.value)) {
        hos_matchmax = parseInt(sliderHospitals.value);
        console.log(grid100_id + ": Hospital max value greater than slider max");
      }
      else if ((feature.get("_hospita_2")/1000) < parseInt(sliderHospitals.value)) {
        hos_matchmax = (feature.get("_hospita_2")/1000);
        console.log(grid100_id + ": Hospital max value smaller than slider max");
      }
      
      // Getting the minimum matching distance value
      else if ((feature.get("_hospita_1")/1000) == 0) {
        hos_matchmin = 0;
        console.log(grid100_id + ": Hospital min value equal to 1");
      }
      else if ((feature.get("_hospita_1")/1000 > 0)) {
        hos_matchmin = (feature.get("_hospita_1")/1000);
        console.log(grid100_id + ": Hospital slider value smaller than Cell min");
      }

    // MATCH PERCENTAGE FOR LEISURE PARKS
    // When user input doesn 't match cell range
    if ((feature.get("_leisure_1")/1000) > parseInt(sliderParks.value)) {
      parks_matchmax = 0;
      parks_matchmin = 0;
      console.log(grid100_id + ": Parks min value larger than slider max");
    }
      else if (parseInt(sliderParks.value) == (feature.get("_leisure_1") /1000)) {
        parks_matchmax = 0;
        parks_matchmin = 0;
        console.log(grid100_id + ": Parks min value equal to slider max");
      }
      
      // Getting the maximum matching distance value
      else if ((feature.get("_leisure_2")/1000) == parseInt(sliderParks.value)) {
        parks_matchmax = (feature.get("_leisure_2")/1000);
        console.log(grid100_id + ": Parks max value equal to slider max");
      }
      else if ((feature.get("_leisure_2")/1000) > parseInt(sliderParks.value)) {
        parks_matchmax = parseInt(sliderParks.value);
        console.log(grid100_id + ": Parks max value greater than slider max");
      }
      else if ((feature.get("_leisure_2")/1000) < parseInt(sliderParks.value)) {
        parks_matchmax = (feature.get("_leisure_2")/1000);
        console.log(grid100_id + ": Parks max value smaller than Parks slider max");
      }
      
      // Getting the minimum matching distance value
      else if ((feature.get("_leisure_1")/1000) == 0) {
        parks_matchmin = 0;
        console.log(grid100_id + ":Parks min value equal to 1");
      }
      else if ((feature.get("_leisure_1")/1000 > 0)) {
      parks_matchmin = (feature.get("_leisure_1")/1000);
      console.log(grid100_id + ": Parks slider value smaller than cell min ");
      }
  
    // MATCH PERCENTAGE FOR ROADS
    // When user input doesn 't match cell range
    if ((feature.get("_roadsmin")/1000) > parseInt(sliderRoads.value)) {
        roads_matchmax = 0;
        roads_matchmin = 0;
        console.log(grid100_id + ": Roads min value larger than slider max");
      }
      else if (parseInt(sliderRoads.value) == (feature.get("_roadsmin")/1000)) {
        roads_matchmax = 0;
        roads_matchmin = 0;
        console.log(grid100_id + ": Roads min value equal to slider max");
      }
      
      // Getting the maximum matching distance value
      else if ((feature.get("_roadsmax")/1000) == parseInt(sliderRoads.value)) {
        roads_matchmax = (feature.get("_roadsmax")/1000);
        console.log(grid100_id + ": Roads max value equal to slider max");
      }
      else if ((feature.get("_roadsmax")/1000) > parseInt(sliderRoads.value)) {
        roads_matchmax = parseInt(sliderRoads.value);
        console.log(grid100_id + ": Roads max value greater than slider max");
      }
      else if ((feature.get("_roadsmax")/1000) < parseInt(sliderRoads.value)) {
      roads_matchmax = (feature.get("_roadsmax")/1000);
      console.log(grid100_id + ": Roads max value smaller than slider max");
      }
      
      // Getting the minimum matching distance value
      else if ((feature.get("_roadsmin")/1000) == 0) {
        roads_matchmin = 0;
        console.log(grid100_id + ": Roads min value equal to 1");
      }
      else if ((feature.get("_roadsmin")/1000 > 0)) {
        roads_matchmin = (feature.get("_roadsmin")/1000);
        console.log(grid100_id + ": Roads slider value smaller than cell min");
      }
    // MATCH PERCENTAGE FOR SUPERMARKETS
    // When user input doesn 't match cell range
    if ((feature.get("_superma_1")/1000) > parseInt(sliderMarkets.value)) {
      markets_matchmax = 0;
      markets_matchmin = 0;
      console.log(grid100_id + ": Markets min value larger than slider max");
    }
      else if (parseInt(sliderMarkets.value) == (feature.get("_superma_1")/1000)) {
        markets_matchmax = 0;
        markets_matchmin = 0;
        console.log(grid100_id + ": Markets min value equal to slider max");
      }
      
      // Getting the maximum matching distance value
      else if ((feature.get("_superma_2")/1000) == parseInt(sliderMarkets.value)) {
        markets_matchmax = (feature.get("_superma_2")/1000);
        console.log(grid100_id + ": Markets max value equal to slider max");
      }
      else if ((feature.get("_superma_2")/1000) > parseInt(sliderMarkets.value)) {
        markets_matchmax = parseInt(sliderMarkets.value);
        console.log(grid100_id + ": Markets max value greater than slider max");
      }
      else if ((feature.get("_superma_2")/1000) < parseInt(sliderMarkets.value)) {
        markets_matchmax = (feature.get("_superma_2")/1000);
        console.log(grid100_id + ": Market max value smaller than slider max");
      }
      
      // Getting the minimum matching distance value
      else if ((feature.get("_superma_1")/1000) == 0) {
        markets_matchmin = 0;
        console.log(grid100_id + ": Markets min value equal to 1");
      }
      else if ((feature.get("_superma_1")/1000 > 0)) {
      markets_matchmin = (feature.get("_superma_1")/1000);
      console.log(grid100_id + ": Markets slider value smaller than cell min");
      }
 

      // MATCH PERCENTAGE FOR PUBLIC TRANSPORT STOPS
    // When user input doesn't match cell range
    if ((feature.get("_pt_stop_1")/1000) > parseInt(sliderPstops.value)) {
      ptst_matchmax = 0; 
      ptst_matchmin = 0; 
      console.log(grid100_id + ": Cell min larger than PT stops slider");
    }
      else if (parseInt(sliderPstops.value) == (feature.get("_pt_stop_1")/1000)) {
        ptst_matchmax = 0;
        ptst_matchmin = 0;
        console.log (grid100_id + ": Cell min equal to PT stops slider");
      }
    
      // Getting the maximum matching distance value
      else if ((feature.get("_pt_stop_2")/1000) == parseInt(sliderPstops.value)) {
        ptst_matchmax = (feature.get("_pt_stop_2")/1000);
        console.log(grid100_id + ": Cell max equal to PT stops slider");
      }
      else if (( feature.get("_pt_stop_2")/1000) > parseInt(sliderPstops.value)) {
        ptst_matchmax = parseInt(sliderPstops.value);
        console.log(grid100_id + ": Cell max greater than PT stops slider");
      }
      else if ((feature.get("_pt_stop_2")/1000) < parseInt(sliderPstops.value)) {
        ptst_matchmax = (feature.get("_pt_stop_2")/1000);
        console.log(grid100_id + ": Cell max smaller than PT stops slider");
      }
    
      // Getting the minimum matching distance value
      else if ((feature.get("_pt_stop_1")/1000) == 0) {
        ptst_matchmin = 0;
        console.log(grid100_id + ": Cell min equal to 0.");
      }
      else if ((feature.get("_pt_stop_1") /1000 > 0)) {
        ptst_matchmin = (feature.get("_pt_stop_1")/1000);
        console.log(grid100_id + ": Minimum user slider (0) smaller than cell min.");
      }
    
          // MATCH PERCENTAGE FOR PUBLIC TRANSPORT STATIONS
    // When user input doesn't match cell range
    if ((feature.get("_pt_stat_1")/1000) > parseInt(sliderPstations.value)) {
      ptsta_matchmax = 0; 
      ptsta_matchmin = 0; 
      console.log(grid100_id + ": Cell min larger than PT stations slider");
    }
      else if (parseInt(sliderPstations.value) == (feature.get("_pt_stat_1")/1000)) {
        ptsta_matchmax = 0;
        ptsta_matchmin = 0;
        console.log (grid100_id + ": Cell min equal to PT stations slider");
      }
    
      // Getting the maximum matching distance value
      else if ((feature.get("_pt_stat_2")/1000) == parseInt(sliderPstations.value)) {
        ptsta_matchmax = (feature.get("_pt_stat_2")/1000);
        console.log(grid100_id + ": Cell max equal to PT stations slider");
      }
      else if (( feature.get("_pt_stat_2")/1000) > parseInt(sliderPstations.value)) {
        ptsta_matchmax = parseInt(sliderPstations.value);
        console.log(grid100_id + ": Cell max greater than PT stations slider");
      }
      else if ((feature.get("_pt_stations_2")/1000) < parseInt(sliderPstations.value)) {
        ptsta_matchmax = (feature.get("_pt_stat_2")/1000);
        console.log(grid100_id + ": Cell max smaller than PT stations slider");
      }
    
      // Getting the minimum matching distance value
      else if ((feature.get("_pt_stat_1")/1000) == 0) {
        ptsta_matchmin = 0;
        console.log(grid100_id + ": Cell min equal to 0.");
      }
      else if ((feature.get("_pt_stat_1") /1000 > 0)) {
        ptsta_matchmin = (feature.get("_pt_stat_1")/1000);
        console.log(grid100_id + ": Minimum user slider (0) smaller than cell min.");
      }
    
    // MATCH PERCENTAGE FOR RESTAURANTS
      // When user input doesn 't match cell range
      if ((feature.get("_restaur_1")/1000) > parseInt(sliderRestuarants.value)) {
        resto_matchmax = 0;
        resto_matchmin = 0;
        console.log(grid100_id + ": Resto min larger than slider max");
      }
        else if (parseInt(sliderRestuarants.value) == (feature.get("_restaur_1")/1000)) {
          resto_matchmax = 0;
          resto_matchmin = 0;
          console.log(grid100_id + ": Coast min value equal to slider max");
        }
        
        // Getting the maximum matching distance value
        else if ((feature.get("_restaur_2")/1000) == parseInt(sliderRestuarants.value)) {
          resto_matchmax = (feature.get("_restaur_2")/1000);
          console.log(grid100_id + ": Coast max value equal to slider max");
        }
        else if ((feature.get("_restaur_2")/1000) > parseInt(sliderRestuarants.value)) {
          resto_matchmax = parseInt(sliderRestuarants.value);
          console.log(grid100_id + ": Coast max value greater than slider max");
        }
        else if ((feature.get("_restaur_2")/1000) < parseInt(sliderRestuarants.value)) {
          resto_matchmax = (feature.get("_restaur_2")/1000);
          console.log(grid100_id + ": Resto max value smaller than slider max");
        }
        
        // Getting the minimum matching distance value
        else if ((feature.get("_restaur_1")/1000) == 0) {
          resto_matchmin = 0;
          console.log(grid100_id + ": Resto min value equal to 0");
        }
        else if ((feature.get("_restaur_1")/1000 > 0)) {
          resto_matchmin = (feature.get("_restaur_1")/1000);
          console.log(grid100_id + ": Resto user slider smaller than cell value");
        }

    // MATCH PERCENTAGE FOR HOUSE PRICES
    // When user input doesn 't match cell range
    if ((feature.get("housepri_2")/1000) > parseInt(sliderHprice.value)) {
      house_matchmax = 0;
      house_matchmin = 0;
      console.log(grid100_id + ": HPrice min value larger than slider max");
    }
      else if (parseInt(sliderMarkets.value) == (feature.get("housepri_2")/1000)) {
        house_matchmax = 0;
        house_matchmin = 0;
        console.log(grid100_id + ": HPrice min value equal to slider max");
      }
      
      // Getting the maximum matching distance value
      else if ((feature.get("housepri_3")/1000) == parseInt(sliderHprice.value)) {
        house_matchmax = (feature.get("housepri_3")/1000);
        console.log(grid100_id + ": Hprice max value equal to slider max");
      }
      else if ((feature.get("housepri_3")/1000) > parseInt(sliderHprice.value)) {
        house_matchmax = parseInt(sliderHprice.value);
        console.log(grid100_id + ": HPrice max value greater than slider max");
      }
      else if ((feature.get("housepri_3")/1000) < parseInt(sliderHprice.value)) {
        house_matchmax = (feature.get("housepri_3")/1000);
        console.log(grid100_id + ": HPrice max value smaller than slider max");
      }
      
      // Getting the minimum matching distance value
      else if ((feature.get("housepri_2")/1000) == 0) {
        house_matchmin = 0;
        console.log(grid100_id + ": HPrices min value equal to 1");
      }
      else if ((feature.get("housepri_2")/1000) > 0) { 
        house_matchmin = (feature.get("housepri_2") /1000);
        console.log(grid100_id + ": HPrices slider value smaller than cell min");
      }
    
    //UNIVERSITIES matching percentage
    uni_matchdiff = (uni_matchmax - uni_matchmin);
    cell_int_u = (feature.get("_univers_2")/1000) - (feature.get("_univers_1")/1000);
    // Getting the match percentage
    uni_match_perc = (uni_matchdiff * 100) / cell_int_u;
    
    //SCHOOLS matching percentage
    sch_matchdiff = (sch_matchmax - sch_matchmin);
    cell_int_sch = (feature.get("_schoolsma")/1000) - (feature.get("_schoolsmi")/1000);
    // Getting the match percentage
    sch_match_perc = ( sch_matchdiff * 100) / cell_int_sch;
    
    //COASTLINE matching percentage
    coast_matchdiff = (coast_matchmax - coast_matchmin);
    cell_int_coast = (feature.get("_coastli_2")/1000) - (feature.get("_coastli_1")/1000);
    // Getting the match percentage
    coast_match_perc = ( coast_matchdiff * 100) / cell_int_coast;
      
    //HOSPITALS matching percentage
    hos_matchdiff = (hos_matchmax - hos_matchmin);
    cell_int_hos = (feature.get("_hospita_2")/1000) - (feature.get("_hospita_1")/1000);
    // Getting the match percentage
    hos_match_perc = (hos_matchdiff * 100) / cell_int_hos;
      
    //PARKS matching percentage
    parks_matchdiff = (parks_matchmax - parks_matchmin);
    cell_int_parks = (feature.get("_leisure_2")/1000) - (feature.get("_leisure_1")/1000);
    // Getting the match percentage
    parks_match_perc = (parks_matchdiff * 100) / cell_int_parks;
      
    // ROADS matching percentage
    roads_matchdiff = (roads_matchmax - roads_matchmin);
    cell_int_roads = (feature.get("_roadsmax")/1000) - (feature.get("_roadsmin")/1000);
    // Getting the match percentage
    roads_match_perc = (roads_matchdiff * 100) / cell_int_roads;
      
    // SUPERMARKETS matching percentage
    markets_matchdiff = (markets_matchmax - markets_matchmin);
    cell_int_markets = (feature.get("_superma_2")/1000) - (feature.get("_superma_1")/1000);
    // Getting the match percentage
    markets_match_perc = ( markets_matchdiff * 100) / cell_int_markets;
    
    // PUBLIC TRANSPORT STOPS matching percentage
    ptst_matchdiff = (ptst_matchmax - ptst_matchmin);
    cell_int_ptst = (feature.get("_pt_stop_2")/1000) - (feature.get("_pt_stop_1")/1000);
    // Getting the match percentage
    ptst_match_perc = ( ptst_matchdiff * 100) / cell_int_ptst;
    
    // PUBLIC TRANSPORT STATIONS matching percentage
    ptsta_matchdiff = (ptsta_matchmax - ptsta_matchmin);
    cell_int_ptsta = (feature.get("_pt_stat_2")/1000) - (feature.get("_pt_stat_1")/1000);
    // Getting the match percentage
    ptsta_match_perc = ( ptsta_matchdiff * 100) / cell_int_ptsta;

    // RESTAURANTS matching percentage
    resto_matchdiff = (resto_matchmax - resto_matchmin);
    cell_int_resto = (feature.get("_pt_restaur_2")/1000) - (feature.get("_pt_restaur_1")/1000);
    // Getting the match percentage
    resto_match_perc = ( resto_matchdiff * 100) / cell_int_resto;
    
    // HOUSE PRICES matching percentage
    house_matchdiff = (house_matchmax - house_matchmin);
    cell_int_house = (feature.get("housepri_3")/1000) - (feature.get("housepri_2")/1000);
    // Getting the match percentage
    house_match_perc = (house_matchdiff * 100) / cell_int_house; 

    // OVERALL PERCENTAGE CELL MATCH
    var new_fuzzy_value_100km;
    new_fuzzy_value_100km = ((ptsta_matchdiff + ptst_matchdiff + resto_matchdiff + markets_matchdiff + roads_matchdiff + parks_matchdiff + uni_matchdiff + sch_matchdiff + coast_matchdiff + hos_matchdiff) * 100)/ (cell_int_resto + cell_int_ptsta + cell_int_ptst + cell_int_markets + cell_int_coast + cell_int_hos + cell_int_parks + cell_int_u + cell_int_sch + cell_int_roads);
    feature.set("fuzzyvalue", new_fuzzy_value_100km);
    console.log("Cell " + grid100_id + " Fuzzy Value: " + new_fuzzy_value_100km);
    accessibility_100 = (((roads_matchdiff + ptsta_matchdiff + ptst_matchdiff)*100 / (cell_int_ptsta + cell_int_ptst + cell_int_roads)));
    livability_100 = ((resto_matchdiff + markets_matchdiff + parks_matchdiff + uni_matchdiff + sch_matchdiff + coast_matchdiff + hos_matchdiff) * 100) / ( cell_int_resto + cell_int_markets+ cell_int_coast + cell_int_hos + cell_int_parks + cell_int_u +cell_int_sch);
    suitability_100 = ((((house_matchdiff)*100) / cell_int_house));
    feature.set("accessibility", accessibility_100);
    feature.set("livability", livability_100);
    feature.set("suitability", suitability_100);
  }); 
  };


    // // Calculate Weights for 100km Grid
  // var source_100km = grid100km.getSource();
  // var features_100km = source_100km.getFeatures();

  // var hospitals_100;
  // var parks_100;
  // var roads_100;
  // var schools_100;
  // var markets_100;
  // var uni_100;
  // var stops_100;
  // var stations_100;
  // var restuarants_100;
  // var theatres_100;
  // var cinemas_100;
  // var kinder_100;
  // var industries_100;
  // var houseprice_100;
  // var water_100;
  // var coasts_100;
  // var new_fuzzy_value_100km;
  // var accessibility_100;
  // var livability_100;
  // var suitability_100;

  // features_100km.forEach(function(feature){
  //   if (parseInt(sliderUni.value) > (feature.get("_univers_2")/1000)) {
  //     uni_100 = 0}
  //     else if (parseInt(sliderUni.value) == (feature.get("_univers_2")/1000)) {
  //       uni_100 = 0
  //     }
  //     else if (parseInt(sliderUni.value) < (feature.get("_univers_2")/1000)) {
  //       uni_100 = (sliderUni.value - (feature.get("_univers_1")/1000)) / ((feature.get("_univers_2") - feature.get("_univers_1"))/1000)
  //       if (uni_100 < 0) {
  //         uni_100 = 0;
  //       }
  //       else if (uni_100 <= 100) {
  //       }
  //     }
  //   if (parseInt(sliderRoads.value) > (feature.get("_roadsmax")/1000)) {
  //     roads_100 = 0;}
  //     else if (parseInt(sliderRoads.value) == (feature.get("_roadsmax")/1000)) {
  //       roads_100 = 0
  //     }
  //     else if (parseInt(sliderRoads.value) < (feature.get("_roadsmax")/1000)) {
  //       roads_100 = (sliderRoads.value - (feature.get("_roadsmin")/1000)) / ((feature.get("_roadsmax") - feature.get("_roadsmin"))/1000)
  //       if (roads_100 < 0) {
  //         roads_100 = 0;
  //       }
  //       else if (roads_100 <= 100) {
  //       }
  //     }
  //   if (parseInt(sliderCoasts.value) > (feature.get("_coastli_2")/1000)) {
  //     coasts_100 = 0;}
  //     else if (parseInt(sliderCoasts.value) == (feature.get("_coastli_2")/1000)) {
  //       coasts_100 = 0
  //     }
  //     else if (parseInt(sliderCoasts.value) < (feature.get("_coastli_2")/1000)) {
  //       coasts_100 = (sliderCoasts.value - (feature.get("_coastli_1")/1000)) / ((feature.get("_coastli_2") - feature.get("_coastli_1"))/1000)
  //       if (coasts_100 < 0) {
  //         coasts_100 = 0;
  //       }
  //       else if (coasts_100 <= 100) {
  //       }
  //     }
  //   if (parseInt(sliderHospitals.value) > (feature.get("_hospita_2")/1000)) {
  //     hospitals_100 = 0;}
  //     else if (parseInt(sliderHospitals.value) == (feature.get("_hospita_2")/1000)) {
  //       hospitals_100 = 0
  //     }
  //     else if (parseInt(sliderHospitals.value) < (feature.get("_hospita_2")/1000)) {
  //       hospitals_100 = (sliderHospitals.value - (feature.get("_hospita_1")/1000)) / ((feature.get("_hospita_2") - feature.get("_hospita_1"))/1000)
  //       if (hospitals_100 < 0) {
  //         hospitals_100 = 0;
  //       }
  //       else if (hospitals_100 <= 100) {
  //       }
  //     }
  //   if (parseInt(sliderParks.value) > (feature.get("_leisure_2")/1000)) {
  //     parks_100 = 0;}
  //     else if (parseInt(sliderParks.value) == (feature.get("_leisure_2")/1000)) {
  //       parks_100 = 0
  //     }
  //     else if (parseInt(sliderParks.value) < (feature.get("_leisure_2")/1000)) {
  //       parks_100 = (sliderParks.value - (feature.get("_leisure_1")/1000)) / ((feature.get("_leisure_2") - feature.get("_leisure_1"))/1000)
  //       if (parks_100 < 0) {
  //         parks_100 = 0;
  //       }
  //       else if (parks_100 <= 100) {
  //       }
  //     }
  //   if (parseInt(sliderSchools.value) > (feature.get("_schoolsma")/1000)) {
  //     schools_100 = 0;}
  //     else if (parseInt(sliderSchools.value) == (feature.get("_schoolsma")/1000)) {
  //       schools_100 = 0
  //     }
  //     else if (parseInt(sliderSchools.value) < (feature.get("_schoolsma")/1000)) {
  //       schools_100 = (sliderSchools.value - (feature.get("_schoolsmi")/1000)) / ((feature.get("_schoolsma") - feature.get("_schoolsmi"))/1000)
  //       if (schools_100 < 0) {
  //         schools_100 = 0;
  //       }
  //       else if (schools_100 <= 100) {
  //       }
  //     }
  //   if (parseInt(sliderMarkets.value) > (feature.get("_superma_2")/1000)) {
  //     markets_100 = 0;}
  //     else if (parseInt(sliderMarkets.value) == (feature.get("_superma_2")/1000)) {
  //       markets_100 = 0
  //     }
  //     else if (parseInt(sliderMarkets.value) < (feature.get("_superma_2")/1000)) {
  //       markets_100 = (sliderMarkets.value - (feature.get("_superma_1")/1000)) / ((feature.get("_superma_2") - feature.get("_superma_1"))/1000)
  //       if (markets_100 < 0) {
  //         markets_100 = 0;
  //       }
  //       else if (markets_100 <= 100) {
  //       }
  //     }
  //   if (parseInt(sliderPstops.value) > (feature.get("_pt_stop_2")/1000)) {
  //     stops_100 = 0;}
  //     else if (parseInt(sliderPstops.value) == (feature.get("_pt_stop_2")/1000)) {
  //       stops_100 = 0
  //     }
  //     else if (parseInt(sliderPstops.value) < (feature.get("_pt_stop_2")/1000)) {
  //       stops_100 = (sliderPstops.value - (feature.get("_pt_stop_1")/1000)) / ((feature.get("_pt_stop_2") - feature.get("_pt_stop_1"))/1000)
  //       if (stops_100 < 0) {
  //         stops_100 = 0;
  //       }
  //       else if (stops_100 <= 100) {
  //       }
  //     }
  //   if (parseInt(sliderPstations.value) > (feature.get("_pt_stat_2")/1000)) {
  //     stations_100 = 0;}
  //     else if (parseInt(sliderPstations.value) == (feature.get("_pt_stat_2")/1000)) {
  //       stations_100 = 0
  //     }
  //     else if (parseInt(sliderPstations.value) < (feature.get("_pt_stat_2")/1000)) {
  //       stations_100 = (sliderPstations.value - (feature.get("_pt_stat_1")/1000)) / ((feature.get("_pt_stat_2") - feature.get("_pt_stat_1"))/1000)
  //       if (stations_100 < 0) {
  //         stations_100 = 0;
  //       }
  //       else if (stations_100 <= 100) {
  //       }
  //     }
  //   if (parseInt(sliderRestuarants.value) > (feature.get("_restaur_2")/1000)) {
  //     restuarants_100 = 0;}
  //     else if (parseInt(sliderRestuarants.value) == (feature.get("_restaur_2")/1000)) {
  //       restuarants_100 = 0
  //     }
  //     else if (parseInt(sliderRestuarants.value) < (feature.get("_restaur_2")/1000)) {
  //       restuarants_100 = (sliderRestuarants.value - (feature.get("_restaur_1")/1000)) / ((feature.get("_restaur_2") - feature.get("_restaur_1"))/1000)
  //       if (restuarants_100 < 0) {
  //         restuarants_100 = 0;
  //       }
  //       else if (restuarants_100 <= 100) {
  //       }
  //     }
  //   if (parseInt(sliderTheatres.value) > (feature.get("_theatre_2")/1000)) {
  //     theatres_100 = 0;}
  //     else if (parseInt(sliderTheatres.value) == (feature.get("_theatre_2")/1000)) {
  //       theatres_100 = 0
  //     }
  //     else if (parseInt(sliderTheatres.value) < (feature.get("_theatre_2")/1000)) {
  //       theatres_100 = (sliderTheatres.value - (feature.get("_theatre_1")/1000)) / ((feature.get("_theatre_2") - feature.get("_theatre_1"))/1000)
  //       if (theatres_100 < 0) {
  //         theatres_100 = 0;
  //       }
  //       else if (theatres_100 <= 100) {
  //       }
  //     }
  //   if (parseInt(sliderCinemas.value) > (feature.get("_cinemasma")/1000)) {
  //     cinemas_100 = 0;}
  //     else if (parseInt(sliderCinemas.value) == (feature.get("_cinemasma")/1000)) {
  //       cinemas_100 = 0
  //     }
  //     else if (parseInt(sliderCinemas.value) < (feature.get("_cinemasma")/1000)) {
  //       cinemas_100 = (sliderCinemas.value - (feature.get("_cinemasmi")/1000)) / ((feature.get("_cinemasma") - feature.get("_cinemasmi"))/1000)
  //       if (cinemas_100 < 0) {
  //         cinemas_100 = 0;
  //       }
  //       else if (cinemas_100 <= 100) {
  //       }
  //     }
  //   if (parseInt(sliderKinder.value) > (feature.get("_kindermax")/1000)) {
  //     kinder_100 = 0;}
  //     else if (parseInt(sliderKinder.value) == (feature.get("_kindermax")/1000)) {
  //       kinder_100 = 0
  //     }
  //     else if (parseInt(sliderKinder.value) < (feature.get("_kindermax")/1000)) {
  //       kinder_100 = (sliderKinder.value - (feature.get("_kindermin")/1000)) / ((feature.get("_kindermax") - feature.get("_kindermin"))/1000)
  //       if (kinder_100 < 0) {
  //         kinder_100 = 0;
  //       }
  //       else if (kinder_100 <= 100) {
  //       }
  //     }
  //   if (parseInt(sliderIndustry.value) > (feature.get("_industr_2")/1000)) {
  //     industries_100 = 0;}
  //     else if (parseInt(sliderIndustry.value) == (feature.get("_industr_2")/1000)) {
  //       industries_100 = 0
  //     }
  //     else if (parseInt(sliderIndustry.value) < (feature.get("_industr_2")/1000)) {
  //       industries_100 = (sliderIndustry.value - (feature.get("_industr_1")/1000)) / ((feature.get("_industr_2") - feature.get("_industr_1"))/1000)
  //       if (industries_100 < 0) {
  //         industries_100 = 0;
  //       }
  //       else if (industries_100 <= 100) {
  //       }
  //     }
  //   if (parseInt(sliderHprice.value) > feature.get("housepri_3")) {
  //     houseprice_100 = 0;}
  //     else if (parseInt(sliderHprice.value) == feature.get("housepri_3")) {
  //       houseprice_100 = 0
  //     }
  //     else if (parseInt(sliderHprice.value) < feature.get("housepri_3")) {
  //       houseprice_100 = ((sliderHprice.value - feature.get("housepri_2")) / (feature.get("housepri_3") - feature.get("housepri_2")))
  //       if (houseprice_100 < 0) {
  //         houseprice_100 = 0;
  //       }
  //       else if (houseprice_100 <= 100) {
  //       }
  //     }
  //   if (parseInt(sliderWater.value) > feature.get("_waterbo_2")) {
  //     water_100 = 0;}
  //     else if (parseInt(sliderWater.value) == feature.get("_waterbo_2")) {
  //       water_100 = 0
  //     }
  //     else if (parseInt(sliderWater.value) < feature.get("_waterbo_2")) {
  //       water_100 = ((sliderWater.value - feature.get("_waterbo_1")) / (feature.get("_waterbo_2") - feature.get("_waterbo_1")))
  //       if (water_100 < 0) {
  //         water_100 = 0;
  //       }
  //       else if (water_100 <= 100) {
  //       }
  //     }
  //   new_fuzzy_value_100km = (coasts_100 + hospitals_100 + parks_100 + roads_100 + schools_100 + markets_100 + uni_100 + stops_100+ stations_100 + restuarants_100 + theatres_100 + cinemas_100 + kinder_100 + industries_100 + houseprice_100)/16;
  //   feature.set("fuzzyvalue", new_fuzzy_value_100km)
  //   accessibility_100 = (((roads_100 + stops_100 + stations_100) / 3) * 100);
  //   livability_100 = (((uni_100 + schools_100 + kinder_100 + coasts_100 + markets_100 + water_100 + industries_100 + hospitals_100 + restuarants_100 + theatres_100 + cinemas_100 + parks_100) / 12) * 100);
  //   suitability_100 = (((houseprice_100) / 1) * 100);
  //   feature.set("accessibility", accessibility_100);
  //   feature.set("livability", livability_100);
  //   feature.set("suitability", suitability_100);
  //   });

  // Calculate Weights for 30km Grid
  var source_30km = grid30km.getSource();
  var features_30km = source_30km.getFeatures();

  var coasts_30;
  var hospitals_30;
  var parks_30;
  var roads_30;
  var schools_30;
  var markets_30;
  var uni_30;
  var stops_30;
  var stations_30;
  var restuarants_30;
  var theatres_30;
  var cinemas_30;
  var kinder_30;
  var industries_30;
  var houseprice_30;
  var water_30;
  var new_fuzzy_value_30km;
  var accessibility_30;
  var livability_30;
  var suitability_30;


  features_30km.forEach(function(feature){
    if (parseInt(sliderUni.value) > (feature.get("_univers_2")/1000)) {
      uni_30 = 0}
      else if (parseInt(sliderUni.value) == (feature.get("_univers_2")/1000)) {
      uni_30 = 0
      }
      else if (parseInt(sliderUni.value) < (feature.get("_univers_2")/1000)) {
      uni_30 = (sliderUni.value - (feature.get("_univers_1")/1000)) / ((feature.get("_univers_2") - feature.get("_univers_1"))/1000)
        if (uni_30 < 0) {
        uni_30 = 0;
        }
        else if (uni_30 <= 100) {
        }
      }
    if (parseInt(sliderRoads.value) > (feature.get("_roadsmax")/1000)) {
      roads_30 = 0;}
      else if (parseInt(sliderRoads.value) == (feature.get("_roadsmax")/1000)) {
      roads_30 = 0
      }
      else if (parseInt(sliderRoads.value) < (feature.get("_roadsmax")/1000)) {
      roads_30 = (sliderRoads.value - (feature.get("_roadsmin")/1000)) / ((feature.get("_roadsmax") - feature.get("_roadsmin"))/1000)
        if (roads_30 < 0) {
        roads_30 = 0;
        }
        else if (roads_30 <= 100) {
        }
      }
    if (parseInt(sliderCoasts.value) > (feature.get("_coastli_2")/1000)) {
      coasts_30 = 0;}
      else if (parseInt(sliderCoasts.value) == (feature.get("_coastli_2")/1000)) {
      coasts_30 = 0
      }
      else if (parseInt(sliderCoasts.value) < (feature.get("_coastli_2")/1000)) {
      coasts_30 = (sliderCoasts.value - (feature.get("_coastli_1")/1000)) / ((feature.get("_coastli_2") - feature.get("_coastli_1"))/1000)
        if (coasts_30 < 0) {
        coasts_30 = 0;
        }
        else if (coasts_30 <= 100) {
        }
      }
    if (parseInt(sliderHospitals.value) > (feature.get("_hospita_2")/1000)) {
      hospitals_30 = 0;}
      else if (parseInt(sliderHospitals.value) == (feature.get("_hospita_2")/1000)) {
      hospitals_30 = 0
      }
      else if (parseInt(sliderHospitals.value) < (feature.get("_hospita_2")/1000)) {
      hospitals_30 = (sliderHospitals.value - (feature.get("_hospita_1")/1000)) / ((feature.get("_hospita_2") - feature.get("_hospita_1"))/1000)
        if (hospitals_30 < 0) {
        hospitals_30 = 0;
        }
        else if (hospitals_30 <= 100) {
        }
      }
    if (parseInt(sliderParks.value) > (feature.get("_leisure_2")/1000)) {
      parks_30 = 0;}
      else if (parseInt(sliderParks.value) == (feature.get("_leisure_2")/1000)) {
      parks_30 = 0
      }
      else if (parseInt(sliderParks.value) < (feature.get("_leisure_2")/1000)) {
      parks_30 = (sliderParks.value - (feature.get("_leisure_1")/1000)) / ((feature.get("_leisure_2") - feature.get("_leisure_1"))/1000)
        if (parks_30 < 0) {
        parks_30 = 0;
        }
        else if (parks_30 <= 100) {
        }
      }
    if (parseInt(sliderSchools.value) > (feature.get("_schoolsma")/1000)) {
      schools_30 = 0;}
      else if (parseInt(sliderSchools.value) == (feature.get("_schoolsma")/1000)) {
      schools_30 = 0
      }
      else if (parseInt(sliderSchools.value) < (feature.get("_schoolsma")/1000)) {
      schools_30 = (sliderSchools.value - (feature.get("_schoolsmi")/1000)) / ((feature.get("_schoolsma") - feature.get("_schoolsmi"))/1000)
        if (schools_30 < 0) {
        schools_30 = 0;
        }
        else if (schools_30 <= 100) {
        }
      }
    if (parseInt(sliderMarkets.value) > (feature.get("_superma_2")/1000)) {
      markets_30 = 0;}
      else if (parseInt(sliderMarkets.value) == (feature.get("_superma_2")/1000)) {
      markets_30 = 0
      }
      else if (parseInt(sliderMarkets.value) < (feature.get("_superma_2")/1000)) {
      markets_30 = (sliderMarkets.value - (feature.get("_superma_1")/1000)) / ((feature.get("_superma_2") - feature.get("_superma_1"))/1000)
        if (markets_30 < 0) {
        markets_30 = 0;
        }
        else if (markets_30 <= 100) {
        }
      }
    if (parseInt(sliderPstops.value) > (feature.get("_pt_stop_2")/1000)) {
      stops_30 = 0;}
      else if (parseInt(sliderPstops.value) == (feature.get("_pt_stop_2")/1000)) {
      stops_30 = 0
      }
      else if (parseInt(sliderPstops.value) < (feature.get("_pt_stop_2")/1000)) {
      stops_30 = (sliderPstops.value - (feature.get("_pt_stop_1")/1000)) / ((feature.get("_pt_stop_2") - feature.get("_pt_stop_1"))/1000)
        if (stops_30 < 0) {
        stops_30 = 0;
        }
        else if (stops_30 <= 100) {
        }
      }
    if (parseInt(sliderPstations.value) > (feature.get("_pt_stat_2")/1000)) {
      stations_30 = 0;}
      else if (parseInt(sliderPstations.value) == (feature.get("_pt_stat_2")/1000)) {
      stations_30 = 0
      }
      else if (parseInt(sliderPstations.value) < (feature.get("_pt_stat_2")/1000)) {
      stations_30 = (sliderPstations.value - (feature.get("_pt_stat_1")/1000)) / ((feature.get("_pt_stat_2") - feature.get("_pt_stat_1"))/1000)
        if (stations_30 < 0) {
        stations_30 = 0;
        }
        else if (stations_30 <= 100) {
        }
      }
    if (parseInt(sliderRestuarants.value) > (feature.get("_restaur_2")/1000)) {
      restuarants_30 = 0;}
      else if (parseInt(sliderRestuarants.value) == (feature.get("_restaur_2")/1000)) {
      restuarants_30 = 0
      }
      else if (parseInt(sliderRestuarants.value) < (feature.get("_restaur_2")/1000)) {
      restuarants_30 = (sliderRestuarants.value - (feature.get("_restaur_1")/1000)) / ((feature.get("_restaur_2") - feature.get("_restaur_1"))/1000)
        if (restuarants_30 < 0) {
        restuarants_30 = 0;
        }
        else if (restuarants_30 <= 100) {
        }
      }
    if (parseInt(sliderTheatres.value) > (feature.get("_theatre_2")/1000)) {
      theatres_30 = 0;}
      else if (parseInt(sliderTheatres.value) == (feature.get("_theatre_2")/1000)) {
      theatres_30 = 0
      }
      else if (parseInt(sliderTheatres.value) < (feature.get("_theatre_2")/1000)) {
      theatres_30 = (sliderTheatres.value - (feature.get("_theatre_1")/1000)) / ((feature.get("_theatre_2") - feature.get("_theatre_1"))/1000)
        if (theatres_30 < 0) {
        theatres_30 = 0;
        }
        else if (theatres_30 <= 100) {
        }
      }
    if (parseInt(sliderCinemas.value) > (feature.get("_cinemasma")/1000)) {
      cinemas_30 = 0;}
      else if (parseInt(sliderCinemas.value) == (feature.get("_cinemasma")/1000)) {
      cinemas_30 = 0
      }
      else if (parseInt(sliderCinemas.value) < (feature.get("_cinemasma")/1000)) {
      cinemas_30 = (sliderCinemas.value - (feature.get("_cinemasmi")/1000)) / ((feature.get("_cinemasma") - feature.get("_cinemasmi"))/1000)
        if (cinemas_30 < 0) {
        cinemas_30 = 0;
        }
        else if (cinemas_30 <= 100) {
        }
      }
    if (parseInt(sliderKinder.value) > (feature.get("_kindermax")/1000)) {
      kinder_30 = 0;}
      else if (parseInt(sliderKinder.value) == (feature.get("_kindermax")/1000)) {
      kinder_30 = 0
      }
      else if (parseInt(sliderKinder.value) < (feature.get("_kindermax")/1000)) {
      kinder_30 = (sliderKinder.value - (feature.get("_kindermin")/1000)) / ((feature.get("_kindermax") - feature.get("_kindermin"))/1000)
        if (kinder_30 < 0) {
        kinder_30 = 0;
        }
        else if (kinder_30 <= 100) {
        }
      }
    if (parseInt(sliderIndustry.value) > (feature.get("_industr_2")/1000)) {
      industries_30 = 0;}
      else if (parseInt(sliderIndustry.value) == (feature.get("_industr_2")/1000)) {
      industries_30 = 0
      }
      else if (parseInt(sliderIndustry.value) < (feature.get("_industr_2")/1000)) {
      industries_30 = (sliderIndustry.value - (feature.get("_industr_1")/1000)) / ((feature.get("_industr_2") - feature.get("_industr_1"))/1000)
        if (industries_30 < 0) {
        industries_30 = 0;
        }
        else if (industries_30 <= 100) {
        }
      }
    if (parseInt(sliderHprice.value) > feature.get("housepri_3")) {
      houseprice_30 = 0;}
      else if (parseInt(sliderHprice.value) == feature.get("housepri_3")) {
      houseprice_30 = 0
      }
      else if (parseInt(sliderHprice.value) < feature.get("housepri_3")) {
      houseprice_30 = ((sliderHprice.value - feature.get("housepri_2")) / (feature.get("housepri_3") - feature.get("housepri_2")))
        if (houseprice_30 < 0) {
        houseprice_30 = 0;
        }
        else if (houseprice_30 <= 100) {
        }
      }
    if (parseInt(sliderWater.value) > feature.get("_waterbo_2")) {
      water_30 = 0;}
      else if (parseInt(sliderWater.value) == feature.get("_waterbo_2")) {
        water_30 = 0
      }
      else if (parseInt(sliderWater.value) < feature.get("_waterbo_2")) {
        water_30 = ((sliderWater.value - feature.get("_waterbo_1")) / (feature.get("_waterbo_2") - feature.get("_waterbo_1")))
        if (water_30 < 0) {
          water_30 = 0;
        }
        else if (water_30 <= 100) {
        }
      }
    new_fuzzy_value_30km = (coasts_30 + hospitals_30 + parks_30 + roads_30 + schools_30 + markets_30 + uni_30 + stops_30+ stations_30 + restuarants_30 + theatres_30 + cinemas_30 + kinder_30 + industries_30 + houseprice_30)/16;
    feature.set("fuzzyvalue", new_fuzzy_value_30km);
    accessibility_30 = (((roads_30 + stops_30 + stations_30) / 3) * 100);
    livability_30 = (((uni_30 + schools_30 + kinder_30 + coasts_30 + markets_30 + water_30 + industries_30 + hospitals_30 + restuarants_30 + theatres_30 + cinemas_30 + parks_30) / 12) * 100);
    suitability_30 = (((houseprice_30) / 1) * 100);
    feature.set("accessibility", accessibility_30);
    feature.set("livability", livability_30);
    feature.set("suitability", suitability_30);
  });
;

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