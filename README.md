<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/aboestpetersen/Spring21_AAU_Project">
    <img src="images/HomeLocator Logo.png" alt="Logo" width="500" height="500">
  </a>

  <h3 align="center">HomeLocator</h3>

  <p align="center">
    Repository for Spring 2021 semester geoinformatics project for building a real estate web GIS application.
    <br />
    <br />
    <a href="https://realestate-aauspring2021.herokuapp.com/">View Demo</a>
    ·
    <a href="https://github.com/aboestpetersen/Spring21_AAU_Project/issues">Report Bug</a>
    ·
    <a href="https://github.com/aboestpetersen/Spring21_AAU_Project/issues">Request Feature</a>
  </p>
</p>

#### Run App Locally:
1. Open Command Prompt/Terminal.
2. Set directory.
```
cd new-project
```
3. Initiate local host.
```
npm start
```
4. Navigate to http://localhost:1234 (or wherever NPM tells you navigate to).

### Progress Notes:
* Added Municipalities boundaries from GitHub (NOT GML, couldn't get that working...). -22.03.2021 ABP
    * Added "Home" button to return user to default extent as well as a scaleline. -ABP
    * Added navigation bar at the top, the buttons don't do anything yet. -ABP
    * Cleaned navigation bar, added structure to files, and enabled "About" button so it loads a page now. -ABP
    * Added DK boundary & labels. Search bar has been added but doesn't do anything yet. -ABP
    * Now layers are scale dependent, renders depend on zoom level. -ABP
* Revised Home Button, added search for address functionality using OSM Geocoder. -23.03.21 ABP
    * Added cities from GitHub, need to clip them to Denmark -25.03.21 MLT 
    * Tried to display features from OSM as GeoJSON files, for some reason they're not showing up. The updated
code is here (index.js). Added the OSM GeoJSON files here-02.04.2021  MLT 
    * Began Search Criteria Panel. -ABP
* LayerSwitcher added. -09.04.2021 ABP
* Added Basemap options and fullscreen button. -11.04.2021 ABP
* Read local GeoJSON files. -26.04.2021 ABP
* Created proximity rasters for each of the features (50x50m grids). -30.04.2021 MLT
* Edit "About" page. -01.05.2021 ABP
* Switch to Bootstrap Navbar. -02.05.2021 ABP
* Replaced custom home button with OL 'ZoomToExtent' button, so map controls stay within map instead of being attached to the html element. -03.05.2021 ABP
* Merged grids (1km, 30km, 100km) with hospital features -as a sample -03.05.2021 MLT
* Built splash screen for general info/tutorial for end user. -04.05.2021 ABP
    * Updated Logos & Favicon.
* Merged grids (1km, 30km, 100km) with all features individually and then created the final weighted grids, with the features we have so far -04.05.2021 MLT
* Added distance sliders that are toggled by checked options. -05.05.2021 ABP
* Added coastline, roads and water bodies to the weighted grids -05.07.2021 MLT
* Re-doing weighted grids with proximity rasters at finer resolution (15mx15m) and adding supermarkets -05.10.2021 MLT
* Finished weighted grids with proximity rasters at finer resolution (15mx15m) and added supermarkets data. Working on processing public transport data -05.11.2021 MLT
* Added public transport stations, public transport stops, restaurants and theatres to the weighted grids. Working on adding cinemas. Got crime rate data -05.14.2021 MLT
* Built Sliders for testing. 'Commit Search' button now applies weighted grid coloring scheme (weights are random right now) -05.16.2021 ABP
* Added cinemas and kindergartens to the weighted grids. Filtered political parties data per municipality (see images below and feel free to check if they're ok, specially the political parties one as I'm not danish hahah) 05.18.21 MLT
* Added industries to the weighted grids. Downloaded noise data, but it's not useful for our project. Working on filtering and processing air quality data (2018) and trying to look for an updated dataset (although they're in points layer (only 6 stations in Dk) and not raster layer-the format that we need) 05.19.21 MLT
* Found house price data split into postal code areas (it's in dkk/m2) from Statbank- Finans Danmark. Ongoing work: Combine this data with the hexagon cell grids. 'House Price Data' folder in OneDrive contains some files. Note that not all the postal code areas contain data. 05.20.2021 MLT
* Processed house price data and added crime and house price data to the grids. Final grids are uploaded in the 'ProximityGrids_Final' folder as shapefiles. For data processing details have a look at the README.txt file in the same folder. The 'GeoJSON regions 1km grid' folder contains the updated grids split into regions (EPSG:4326 WGS 84). 05.24.2021 MLT
* Processed air quality data and political party data. New grids are updated in One Drive, have a look at the README_2 file, will describe it better soon as there's a lot of info to include, new version of 1km grid split into regions files need to be uploaded. 05.26.2021 MLT
* Created and described the Data Sources page on the webapp. New (and hopefully final) version of 1km grid split into regions in OneDrive, also final .shp and .GeoJSON feature layers in OneDrive. 05.27.2021 MLT

### Data Processing: 

A) Processed OSM raw data to get a unique layer per feature (they're combined in point and polygon layers)

B) Created proximity rasters for each of the features- 30.04.21 MLT:
* Schools, Universities, Hospitals and Leisure Parks.
Projection is ETRS 1989- UTM Zone 32 N (can be reprojected)
* (stored in OneDrive: Under Proximity_Rasters folder)
 https://aaudk-my.sharepoint.com/personal/aboest20_student_aau_dk/_layouts/15/onedrive.aspx?csf=1&web=1&e=vfrd64&cid=f45853db%2D5a9a%2D45bc%2D8650%2D1b7274a60f8b&id=%2Fpersonal%2Faboest20%5Fstudent%5Faau%5Fdk%2FDocuments%2FSpring%202021%2FSpring%202021%20Semester%20Project%2FData&FolderCTID=0x012000691A31CA3428DA419A23C4A93D1B75C9

C) Merged grids (1km, 30km, 100km) with hospitals feature -as a sample -03.05.2021 MLT

* (stored in OneDrive -same link above-: Under ProximityGrids_Individual_shp folder)

D) Merged grids with all features individually, (hospitals, schools, universities and leisure parks), -04.05.2021 MLT
and then combined them to get the final layer for each grid size.

* (stored in OneDrive -same link above-: Under ProximityGrids_Individual_shp folder)
* (stored in OneDrive -same link above-: Under ProximityGrids_Final_shp folder)

E) Added coastline, roads and water bodies to the weighted grids -05.07.2021 MLT

Roads: based on primary and secondary roads (tertiary was a little too much I think)
Water Bodies: excluded wetlands and filtered water bodies equal or greater than 2000 m2

F) Re-did weighted grids with proximity rasters at a finer resolution and added supermarkets data 05.10/11.2021 MLT

### FEATURES THAT ARE INCLUDED IN THE WEIGHTED GRID SO FAR: 
Distance to: coastline, hospitals, leisure parks, roads, schools, supermarkets, universities, water bodies, public transport stations, public transport stops, restaurants, theatres, cinemas, kindergartens, industries, crimes, political party, house prices (dkk/m2), air quality data (ug/m3)

Crime Rates:
[Crime Rates](data/crime_rates.png)

Political Parties:
[Political Parties](data/political_party.png)

Sample of average distance to roads- 1km grid:
[ProximityGridRoads](images/roads1km.png)
OSM Layers that we have so far: universities, schools, leisure parks and hospitals (projection EPSG: 4326- WGS 84-
Last Accessed: 04-12-21)

Sample of app so far:
[Image of App Progress](images/app_progress.png)
