from math import radians, sin, cos, atan2, sqrt

import requests
from flask import Flask, request, jsonify, render_template, send_from_directory
from geopy.geocoders import Nominatim
from requests.models import Response

app = Flask(__name__, static_url_path="/static")
geolocator = Nominatim(user_agent="geo_loc")
response: Response

with app.app_context():
    print("Setting up before the first request")
    response = requests.get('https://raw.githubusercontent.com/mwgg/Airports/master/airports.json')
    if response.status_code == 200:
        # Load the JSON data from the response
        data = response.json()
    else:
        print("Error: Could not load data from URL.")


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/location_data', methods=['POST'])
def location_data():
    lat = request.form.get('lat')
    lon = request.form.get('lon')
    return jsonify(lat=lat, lon=lon)


@app.route('/get_coordinates', methods=['POST'])
def get_coordinates():
    address = request.json['address']
    location = geolocator.geocode(address)
    lat = location.latitude
    lon = location.longitude
    return jsonify(lat=lat, lon=lon)


@app.route('/send_static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)


@app.route('/airports/<lat>/<lon>')
def closest_airport(lat, lon):
    lat = float(lat)
    lon = float(lon)
    distances = []
    for airport in data.values():
        distance = haversine(lat, lon, airport["lat"], airport["lon"])
        distances.append((distance, airport))
    distances.sort(key=lambda x: x[0])
    # return closest
    return distances[0][1]


def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # radius of Earth in km
    dLat = radians(lat2 - lat1)
    dLon = radians(lon2 - lon1)
    lat1 = radians(lat1)
    lat2 = radians(lat2)
    a = sin(dLat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dLon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c
    return distance


if __name__ == '__main__':
    app.run(debug=True)
