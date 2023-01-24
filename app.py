from flask import Flask, request, jsonify, render_template
from geopy.geocoders import Nominatim

app = Flask(__name__)


@app.route('/')
def index():
    return render_template("location.html")


# @app.route('/location')
# def location():
#     return render_template('location.html')


@app.route('/location_data', methods=['POST'])
def location_data():
    lat = request.form.get('lat')
    lon = request.form.get('lon')
    return jsonify(lat=lat, lon=lon)
    # geolocator = Nominatim(user_agent="myGeocoder")
    # location = geolocator.reverse(f"{lat}, {lon}", exactly_one=True)
    # city = location.raw['address'].get('town') or location.raw['address'].get('city') or location.raw['address'].get(
    #     'village')
    # return jsonify({"city": city} if city else {"error": "Unable to determine location"})

@app.route('/get_coordinates')
def get_coordinates():
    lat = 45.5231
    lon = -122.6765
    return jsonify(lat=lat, lon=lon)

if __name__ == '__main__':
    app.run()
