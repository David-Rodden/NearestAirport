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
    // getting our current position here in lat/lon
    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude, lon = position.coords.longitude;
        marker = L.marker([lat, lon]).addTo(map);
        map.setView([lat, lon], 13);
        // getting nearest airport by calling our flask endpoint
        fetch(`/airports/${lat}/${lon}`)
            .then(response => {
                var c = response.json()
                console.log(c);
                return c;
            })
            .then(data => {
                // Create a new marker on the leaflet map
                const marker = L.marker([data.lat, data.lon]).addTo(map);
                marker.bindPopup(data.name).openPopup();
            });
    }, function (error) {
        if (error.code === error.PERMISSION_DENIED) {
            alert("You denied access to your location. Please provide your location manually.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
            alert("Your location is currently unavailable. Please try again later.");
        }
    });
});