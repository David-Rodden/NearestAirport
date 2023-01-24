let marker;
const map = L.map('map').setView([37.7749, -122.4194], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 18
}).addTo(map);
$("#location-form").submit(function (event) {
    event.preventDefault();
    if (marker) {
        map.removeLayer(marker);
    }
    navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        marker = L.marker([lat, lon]).addTo(map);
        map.setView([lat, lon], 13);
    }, function (error) {
        if (error.code === error.PERMISSION_DENIED) {
            alert("You denied access to your location. Please provide your location manually.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
            alert("Your location is currently unavailable. Please try again later.");
        }
    });
});