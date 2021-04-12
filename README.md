# Web App Helping Homebuyers Locate Suitable Areas
Repository for Spring 2021 semester geoinformatics project for building a real estate web GIS application.

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

#### Progress Notes:
* Added Municipalities boundaries from GitHub (NOT GML, couldn't get that working...). -22.03.2021 ABP
    * Added "Home" button to return user to default extent as well as a scaleline. -ABP
    * Added navigation bar at the top, the buttons don't do anything yet. -ABP
    * Cleaned navigation bar, added structure to files, and enabled "About" button so it loads a page now. -ABP
    * Added DK boundary & labels. Search bar has been added but doesn't do anything yet. -ABP
    * Now layers are scale dependent, renders depend on zoom level. -ABP
* Revised Home Button, added search for address functionality using OSM Geocoder. -23.03.21 ABP
    * Began Search Criteria Panel. -ABP
* LayerSwitcher added. -09.04.2021 ABP

Sample of app so far:
[Image of App Progress](images/app_progress.png)