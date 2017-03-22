// This code calculates the distance to each marker in the array using haversine
// formula

// Not sure if such function exists in standard library, so I've written it
// anyway. Function converts degrees to radians
function toRadians(degrees)
{
  return degrees * Math.PI/180;
}

// Main job is done by this function. It implements haversine formula to solve
// the problem
function findNearestMarkers(event)
{
  console.log("Here I am!");
  // Obtain latitude of the place, where map was clicked
  var latitude = event.latLng.lat();
  // Obtain longitude of the place, where map was clicked
  var longitude = event.latLng.lng();
  // Radius of earth in km
  var radiusEarth = 6371;
  // Radius around the marker in meteres
  var markerRadius = 400;
  var closeMarkersCount = 0;

  // Delete all the previous markers on the map
  clearOverlays();
  // Set the marker at the clicked position with circle of certain radius around
  addMarker(latitude, longitude);
  addCircle(latitude, longitude, markerRadius);

  for(index = 0; index < locations.length; index++)
  {
    // Obtain the latitude and longitude of each location
    var markerLatitude = locations[index][1];
    var markerLongitude = locations[index][2];

    console.log(toRadians(markerLatitude));

    var distanceLatitude = toRadians(markerLatitude - latitude);
    var distanceLongitude = toRadians(markerLongitude - longitude);

    console.log(distanceLatitude);

    // More info on this here http://www.movable-type.co.uk/scripts/latlong.html
    var a = Math.sin(distanceLatitude/2) * Math.sin(distanceLatitude/2)
          + Math.cos(toRadians(latitude)) * Math.cos(toRadians(latitude))
          * Math.sin(distanceLongitude/2) * Math.sin(distanceLongitude/2);

    // Math.atan2 calculates the angle in rad between the point and positive x
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = radiusEarth * c * 1000;

    // If the place is inside marker area, add it to the map
    if(d <= markerRadius)
    {
      console.log("I am inside if!");
      var marker = new google.maps.Marker({
        position: {lat: markerLatitude, lng: markerLongitude},
        map: map,
        title: locations[index][0],
        icon: markerIcons[closeMarkersCount % markerIcons.length][1]
      });
      // Add newly created marker to markers array
      markersArray.push(marker);
      closeMarkersCount++;
    }
  }
}

// This function deletes all overlays on the map
function clearOverlays()
{
  for(var index = 0; index < markersArray.length; index++)
  {
    markersArray[index].setMap(null);
  }
  // Clear the array
  markersArray.length = 0;
  // Delete the circle
  for(var index = 0; index < circlesArray.length; index++)
  {
    circlesArray[index].setMap(null);
  }
}

function addMarker(latitude, longitude)
{
  var clickMarker = new google.maps.Marker({
    position: {lat: latitude, lng: longitude},
    map: map,
    animation: google.maps.Animation.DROP
  });

  // Add newly created marker to markers array
  markersArray.push(clickMarker);
  // Define and add a circle, which will appear around the newly set marker
  addCircle(clickMarker);
}

function addCircle(latitude, longitude, radius)
{
  console.log("addCircle is called");
  var circle = new google.maps.Circle({
    center: {lat: latitude, lng: longitude} ,
    map: map,
    radius: radius,
    fillColor: '#ffa500'
  });
  // Add circle to circle array
  circlesArray.push(circle);
}
