let map;
let infoWindow;

function initMap() {

    const firstName = localStorage.getItem('name');
    const address = localStorage.getItem('address');
    const company = localStorage.getItem('company');
    const logo = localStorage.getItem('logo');

    const title = document.getElementById('title');
    const searchDiv = document.getElementById('search-div');
    const successAlert = document.getElementById('success-alert');
    const companyInput = document.getElementById('company-input');

    title.innerHTML = `<h1 class="display-4" id="title">Ok ${firstName}, let's find a ${company} location:</h1>`
    searchDiv.innerHTML = `<input type="text" class="form-control" value="${address}" placeholder="Start with typing in your address..." id="search">`
    successAlert.innerHTML = `Please check your phone for a text message and follow the link for directions. Your order will be ready at ${company} when you arrive.`


    let options = {
        center: {
            lat: 37.8035848,
            lng: -122.4419898
        },
        zoom: 15,
        disableDefaultUI: true,
        styles: [
            {
              "featureType": "administrative",
              "elementType": "geometry",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "poi",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road.local",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "transit",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            }
          ]
    };

    map = new google.maps.Map(document.getElementById('map'), options);
    infoWindow = new google.maps.InfoWindow;

    let userLocation;

    // Initialize an autocomplete object on the "input"
    const input = document.getElementById('search');
    const nearbyLocationsBtn = document.getElementById('find-locations');
    const textMeBtn = document.getElementById('text-me');
    const numberInput = document.getElementById('number');
    const selectedAddress = document.getElementById('address');
    const storeLocation = document.getElementById('location');
    const submit = document.getElementById('submit');
    let autocomplete = new google.maps.places.Autocomplete(input);

    const icon = {
     url: './gps.png',
     scaledSize: new google.maps.Size(30, 30)
    }

    let markers = [];

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        markers.forEach(function (m) { m.setMap(null); })
        markers = [];

        markers.push(new google.maps.Marker({
            map: map,
            title: place.name,
            position: place.geometry.location,
            icon: icon,
            anchorPoint: new google.maps.Point(0, -29)
        }));
    
        if (!place.geometry) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }
    
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
        }

        userLocation = place.geometry.location.toJSON();

        let address = "";
    
        if (place.address_components) {
          address = `${place.address_components[0].long_name} 
          ${place.address_components[1].long_name} 
          `;
        }

        markers.forEach(function (m) {
            // Setting the content of the infoWindow to include Bootstrap styled content
            infoWindow.setContent(`
            <div class="card" style="width: 18rem; border: none;">
                <div class="card-body">
                    <h5 class="card-title">${address}</h5>
                    <p class="card-text">
                    ${place.address_components[3].long_name}, 
                    ${place.address_components[5].long_name}, 
                    ${place.address_components[7].long_name}
                    </p>
                </div>
            </div>
            `)
            infoWindow.setPosition(userLocation)
            infoWindow.open(map, m)
        });

        if (userLocation) {
            nearbyLocationsBtn.style.visibility = "visible";
        };
        
        nearbyLocationsBtn.addEventListener("click", function() {
            companyInput.value = company;
            findNearbyPlaces(userLocation);
        });

        textMeBtn.addEventListener("click", function() {
            numberInput.style.visibility = "visible";
            submit.style.visibility = "visible";
        });

      });

      function calculateAndRenderDirections(origin, destination) {
          const directionsService = new google.maps.DirectionsService();
          const directionsRenderer = new google.maps.DirectionsRenderer({
              markerOptions: {
                  icon: icon
              },
              polylineOptions: {
                  strokeColor: "#a1a7ef"
              }
          });

          directionsRenderer.setPanel(document.getElementById('directions'));

          directionsService.route({
              origin: origin,
              destination: destination,
              travelMode: 'DRIVING',
          }, function (response, status) {
              if (status === "OK") {
                  directionsRenderer.setDirections(response);
              } else {
                  console.log(status)
              }
          });

          directionsRenderer.setMap(map);
          markers.forEach(function(m) {
              m.setMap(null)
          });
          textMeBtn.style.visibility = "visible";
      }

      function findNearbyPlaces(location) {
        const placesService = new google.maps.places.PlacesService(map);

        let request = {
            location: location,
            radius: '10000',
            name: company
        }

        placesService.nearbySearch(request, function(results, status) {
            if (status === 'OK') {
                let a = [];
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i], a[i])
                  };
                  setBounds(markers);
                  // adding a click listener to calculate & render directions
                  markers.forEach(function (m) {
                    m.addListener("click", function () {
                        placesService.findPlaceFromQuery({
                            query: m.title,
                            fields: ['formatted_address'],
                            locationBias: m.position
                        }, function (results, status) {
                            if (status === "OK") {
                                selectedAddress.value = results[0].formatted_address;
                            }
                        })
                        storeLocation.value = m.position;
                        calculateAndRenderDirections(userLocation, m.position);
                        m.setMap(null);
                    });
                });
            }
        });
        
      }

      function createMarker(place) {
        markers.push(new google.maps.Marker({
            map: map,
            title: `${place.name}`,
            position: place.geometry.location,
            icon: icon,
            anchorPoint: new google.maps.Point(0, -29)
        }));
      }

      function setBounds(markersArray) {

        var bounds = new google.maps.LatLngBounds();
        for (var i=0; i < markersArray.length; i++) {
            bounds.extend(markersArray[i].getPosition());
        }
        map.fitBounds(bounds);
    }

}
