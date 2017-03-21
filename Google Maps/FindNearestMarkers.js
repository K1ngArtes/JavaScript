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
  var markerRadius = 1000;
  var distances = [];
  var closeMarkersCount = 0;

  // Set the marker at the clicked position
  addMarker(latitude, longitude);

  for(index = 0; index < locations.length; index++)
  {
    console.log("Inside the for loop!");
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
    // So now distances will hold the distance from marker to the point in m
    distances[index] = d;
    console.log("Index is " + index + " and distance is " + d);

    // If the place is inside marker area, add it to the map
    if(d <= markerRadius)
    {
      console.log("I am inside if!");
      var marker = new google.maps.Marker({
        position: {lat: markerLatitude, lng: markerLongitude},
        map: map,
        title: locations[index][0]
      });
    }
  }
}

function addMarker(latitude, longitude)
{
  var clickMarker = new google.maps.Marker({
    position: {lat: latitude, lng: longitude},
    map: map,
  });
  // Define and add a circle, which will appear around the newly set marker
  addCircle(clickMarker);
}

function addCircle(marker)
{
  center: marker.latLng();

  var circle = new google.maps.Circle({
    map: map,
    radius: 1000,    // 10 miles in metres
    fillColor: '#AA0000'
  });

  circle.bindTo('center', marker, 'position');
}
