from flask import Flask, request, jsonify, render_template
from geopy.geocoders import Nominatim

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/location')
def location():
    return render_template('location.html')


@app.route('/location_data', methods=['POST'])
def location_data():
    lat = request.form.get('lat')
    lon = request.form.get('lon')
    geolocator = Nominatim(user_agent="myGeocoder")
    location = geolocator.reverse(f"{lat}, {lon}", exactly_one=True)
    city = location.raw['address'].get('town') or location.raw['address'].get('city') or location.raw['address'].get(
        'village')
    return jsonify({"city": city} if city else {"error": "Unable to determine location"})


if __name__ == '__main__':
    app.run()
