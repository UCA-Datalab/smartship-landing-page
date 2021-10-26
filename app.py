from flask import Flask, render_template, request
import requests
import json
import datetime as dt

cities = {
    "CADIZ": [36.545344, -6.279833],
    "BOSTON": [42.380193, -70.705909],
    "DAKAR": [14.692417, -17.525908],
    "CARACAS": [10.625383, -66.941741],
}

app = Flask(__name__)


@app.route("/")
def index():
    response = requests.get("http://localhost:5000/api/available_routes/dummy")
    code = response.status_code
    if code == 200:
        city_options = {
            f"{cities['city_start']}-{cities['city_end']}": [
                cities["city_start"],
                cities["city_end"],
            ]
            for cities in response.json()
        }
    else:
        city_options = {
            "CADIZ-BOSTON1": ["CADIZ", "BOSTON"],
            "BOSTON-CADIZ1": ["BOSTON", "CADIZ"],
            "CARACAS-DAKAR1": ["CARACAS", "DAKAR"],
            "DAKAR-CARACAS1": ["DAKAR", "CARACAS"],
        }

    return render_template("form.html", city_options=city_options)


@app.route("/results", methods=["GET", "POST"])
def results():
    boat = request.args.get("boat", type=int)
    city_start, city_end = request.args.get("route", type=str).split("-")
    time_start = request.args.get("date", type=str)

    response = requests.get(
        "http://localhost:5000/api/route/dummy",
        params={
            "boat": boat,
            "city_start": city_start,
            "city_end": city_end,
            "time_start": time_start,
        },
    )

    code = response.status_code

    data = None

    if code == 200:
        data = response.json()
    else:
        data = {
            "city_start": "CADIZ",
            "city_end": "BOSTON",
            "routes": [
                {
                    "coords": [
                        cities["CADIZ"],
                        [35.419390, -17.566927],
                        [35.460547, -32.612874],
                        [35.586265, -53.456290],
                        [37.204040, -61.425619],
                        [35.658101, -68.195426],
                        [39.787861, -68.362122],
                        [42, -69],
                        cities["BOSTON"],
                    ],
                    "fuel": 15,
                },
                {
                    "coords": [
                        cities["CADIZ"],
                        [36.419390, -17.566927],
                        [36.460547, -32.612874],
                        [36.586265, -53.456290],
                        [38.204040, -61.425619],
                        [36.658101, -68.195426],
                        [40.787861, -68.362122],
                        [42, -69],
                        cities["BOSTON"],
                    ],
                    "fuel": 15,
                },
            ],
            "base_route": [cities["CADIZ"], cities["BOSTON"]],
            "base_fuel": 25,
            "boat": 0,
            "time_start": dt.datetime(2020, 12, 3),
            "time_end": dt.datetime(2020, 12, 17),
        }
        with open("static/test_data/currents.json", "r") as f:
            data["currents"] = json.loads(f.read())

        with open("static/test_data/wind.json", "r") as f:
            data["wind"] = json.loads(f.read())

        with open("static/test_data/test_waves.json", "r") as f:
            data["waves"] = json.loads(f.read())

    return render_template("results.html", data=data)


if __name__ == "__main__":
    app.run(debug=True)
