var mymap = L.map('map')
             .setView([50.938056, 6.956944], 13)
             .addLayer(L.tileLayer(
               'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: 18,
                  attribution: 'Map data © \
                  <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
                })
            );
