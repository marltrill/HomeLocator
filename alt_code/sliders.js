// Calculate Weights for 100km Grid
  var source_100km = grid100km.getSource();
  var features_100km = source_100km.getFeatures();
  //var counter_100 = 1; // Count features for testing
  
    /*
    features_100km.forEach(function(feature){
      var new_fuzzy_value_100km = (((parseInt(sliderCoasts.value)/(feature.get("_coastline")/1000)) + (parseInt(sliderHospitals.value)/(feature.get("_hospitals")/1000)) + (parseInt(sliderParks.value)/(feature.get("_leisurepa")/1000)) + (parseInt(sliderRoads.value)/(feature.get("_roadsmean")/1000)) + (parseInt(sliderSchools.value)/(feature.get("_schoolsme")/1000)) + (parseInt(sliderMarkets.value)/(feature.get("_supermark")/1000)) + (parseInt(sliderUni.value)/(feature.get("_universit")/1000)) + (parseInt(sliderWater.value)/(feature.get("_waterbodi")/1000)) + (parseInt(sliderPstations.value)/(feature.get("_pt_statio")/1000)) + (parseInt(sliderPstops.value)/(feature.get("_pt_stopsm")/1000)) + (parseInt(sliderRestuarants.value)/(feature.get("_restauran")/1000)) + (parseInt(sliderTheatres.value)/(feature.get("_theatresm")/1000)) + (parseInt(sliderCinemas.value)/(feature.get("_cinemasme")/1000)) + (parseInt(sliderKinder.value)/feature.get("_kindermea")) + (parseInt(sliderIndustry.value)/(feature.get("_industrie")/1000))) / 261.23441535189943); //15.28740076513416
      feature.set("fuzzyvalue", new_fuzzy_value_100km);
      //console.log("100km->" + counter_100 + ". " + "Feature " + feature.get("id") + ": " + new_fuzzy_value_100km); // Log values for testing
      //counter_100 += 1;
    });
    */

  // Testing New Weighting Scheme
  var coasts_100;
  var hospitals_100;
  var parks_100;
  var roads_100;
  var schools_100;
  var markets_100;
  var uni_100;
  var stops_100;
  var stations_100;
  var restuarants_100;
  var theatres_100;
  var cinemas_100;
  var kinder_100;
  var industries_100;
  var houseprice_100;
  var uni_matchmax;
  var uni_matchmin;
  var uni_matchdiff;
  var cell_rangediff;
  var uni_match_perc;


    
    //MATCH PERCENTAGE FOR UNIVERSITIES
  features_100km.forEach(function(feature){
    // When user input doesn't match cell range   
    if ((feature.get("_univers_1")/1000) > parseInt(sliderUni.value)) {
        uni_matchmax = 0;
        uni_matchmin = 0;
      console.log("Cell min value larger than Uni slider max value. " + uni_100)}
      else if (parseInt(sliderUni.value) == (feature.get("_univers_1")/1000)) {
        uni_matchmax = 0
        uni_matchmin = 0;
        console.log("Cell min value equal to Uni slider max value.")
      // Getting the maximum matching distance value 
      }
      else if ((feature.get("_univers_2")/1000) == parseInt(sliderUni.value)) {
        uni_matchmax = (feature.get("_univers_2")/1000)
        console.log("Cell max value equal to Uni slider max value.")
      }
      else if ((feature.get("_univers_2")/1000) > parseInt(sliderUni.value)) {
        uni_matchmax = parseInt(sliderUni.value)
        console.log("Cell max value greater than Uni slider max value.")
      }
      else if ((feature.get("_univers_2")/1000) < parseInt(sliderUni.value)) {
      uni_matchmax = (feature.get("_univers_2")/1000)
      console.log("Cell max value smaller than Uni slider max value.")
      
      // Getting the minimum matching distance value 
      }
      else if ((feature.get("_univers_1")/1000) == 0) {
      uni_matchmin = 0
      console.log("Cell min value equal to 1.")
      }
    //   else if ((feature.get("_univers_1")/1000 < 0)) {
    //   uni_matchmin = 0
    //   console.log("minimum user slider value (0) greater than Cell min value.")
    //   }
      else if ((feature.get("_univers_1")/1000 > 0)) {
      uni_matchmin = (feature.get("_univers_1")/1000)
      console.log("minimum user slider value (0) smaller than Cell min value.")
      }
        
      uni_matchdiff= (uni_matchmax - uni_matchmin)
      cell_rangediff= (feature.get("_univers_2")/1000) - (feature.get("_univers_1")/1000)
      // Getting the match percentage
      uni_match_perc= (uni_matchdiff* 100)/cell_rangediff
      });