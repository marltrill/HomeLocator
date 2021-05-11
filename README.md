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
* Re-did weighted grids with proximity rasters at finer resolution (15mx15m) and added supermarkets data -05.11.2021 MLT

### Data Processing-20.03.21 MLT : 

A) Processed OSM raw data to get a unique layer per feature (they're combined in point and polygon layers)

OSM Layers that we have so far:
-  universities, schools, leisure parks and hospitals (projection EPSG: 4326- WGS 84-
Last Accessed: 04-12-21)
- roads (projection EPSG: 4326- WGS 84- Last Accessed: 04-13-21)

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

###FEATURES THAT ARE INCLUDED IN THE WEIGHTED GRID SO FAR: 
Distance to: coastline, hospitals, leisure parks, roads, schools, supermarkets, universities, water bodies. 

Sample of average distance to roads- 1km grid:
[ProximityGridRoads](images/roads1km.png)

Sample of app so far:
[Image of App Progress](images/app_progress.png)
