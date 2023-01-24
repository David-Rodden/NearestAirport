let marker, airportMarker;
const map = L.map('map').setView([37.7749, -122.4194], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 18
}).addTo(map);
$("#location-form").submit(function (event) {
    event.preventDefault();
    if (marker) map.removeLayer(marker);
    if (airportMarker) map.removeLayer(airportMarker);
    // getting our current position here in lat/lon
    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude, lon = position.coords.longitude;
        marker = L.marker([lat, lon]).addTo(map);
        map.setView([lat, lon], 13);
        // getting nearest airport by calling our flask endpoint
        fetch(`/airports/${lat}/${lon}`)
            .then(response => response.json())
            .then(data => {
                // Create a new marker on the leaflet map
                airportMarker = L.marker([data.lat, data.lon]).addTo(map);
                airportMarker.bindPopup(data.name).openPopup();
                // defining polyline so we can draw arrow from our home to airport
                const polyline = L.polyline([marker.getLatLng(), airportMarker.getLatLng()]).addTo(map);
                const point1 = turf.point([marker.getLatLng().lng, marker.getLatLng().lat]);
                const point2 = turf.point([airportMarker.getLatLng().lng, airportMarker.getLatLng().lat]);
                const distance = turf.distance(point1, point2, {units: 'miles'});
                const distanceText = `Distance: ${distance.toFixed(2)} miles`;
                const distanceDiv = L.divIcon({
                    className: 'distance-text',
                    html: distanceText,
                });
                L.marker(polyline.getCenter(), {icon: distanceDiv}).addTo(map);
            });
    }, function (error) {
        if (error.code === error.PERMISSION_DENIED) {
            alert("You denied access to your location. Please provide your location manually.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
            alert("Your location is currently unavailable. Please try again later.");
        }
    });
});