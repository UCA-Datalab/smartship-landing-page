from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    make_response,
    json,
)
import gzip
import requests
import datetime as dt
import numpy as np
import math

# Price $/mt, no estoy seguro de que esta sea la medida correcta
FUEL_PRICE = 633.50

cities = {
    "CADIZ": [36.545344, -6.279833],
    "BOSTON": [42.380193, -70.705909],
    "DAKAR": [14.692417, -17.525908],
    "CARACAS": [10.625383, -66.941741],
}

app = Flask(__name__)


@app.route("/")
def index():
    response = requests.get("http://zappa.uca.es:5001/api/available_routes")
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


@app.route("/ocean", methods=["GET", "POST"])
def ocean():

    time_start = request.args.get("time_start", type=str).split(" ")[0]
    time_end = request.args.get("time_end", type=str).split(" ")[0]

    response = requests.get(
        "http://zappa.uca.es:5001/api/ocean",
        params={
            "time_start": time_start,
            "time_end": time_end,
        },
    )

    code = response.status_code

    data = dict()

    if code == 200:

        data = response.json()

    else:
        print(response)
        print(response.url)
        print(response.status_code)

        with open("static/test_data/wind.json", "r") as f:
            data["wind"] = json.loads(f.read())

        with open("static/test_data/currents.json", "r") as f:
            data["currents"] = json.loads(f.read())

        with open("static/test_data/waves.json", "r") as f:
            data["waves"] = json.loads(f.read())

    # fortmat waves heights so leaflet-heatmap con read it
    for i, w in enumerate(data["waves"]):
        data_dict = []
        for lat, lon, h in w["height"]:
            if h > 0:
                data_dict.append({"lat": lat, "lon": lon, "height": h})

        data["waves"][i]["height"] = {"max": 14, "data": data_dict}

    with open("static/libs/coastlines10.json", "r") as f:
        data["mask"] = json.loads(f.read())

    # compress the data before sendinf it
    content = gzip.compress(json.dumps(data).encode("utf8"), 1)
    response = make_response(content)
    response.headers["Content-length"] = len(content)
    response.headers["Content-Encoding"] = "gzip"

    return response


@app.route("/results", methods=["GET", "POST"])
def results():
    boat = request.args.get("boat", type=int)
    city_start, city_end = request.args.get("route", type=str).split("-")
    time_start = request.args.get("date", type=str)

    response = requests.get(
        "http://zappa.uca.es:5001/api/route",
        params={
            "boat": 0,  # boat  # Siempre va a seleccionar el mismo barco
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
                    "fuel_step": [150, 200, 250, 200, 150, 100, 50, 80],
                    "fuel_total": 1180,
                    "timestamps": [
                        str(dt.datetime(2020, 12, 3)),
                        str(dt.datetime(2020, 12, 4)),
                        str(dt.datetime(2020, 12, 5)),
                        str(dt.datetime(2020, 12, 6)),
                        str(dt.datetime(2020, 12, 7)),
                        str(dt.datetime(2020, 12, 8)),
                        str(dt.datetime(2020, 12, 9)),
                        str(dt.datetime(2020, 12, 10)),
                        str(dt.datetime(2020, 12, 11)),
                    ],
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
                    "fuel_step": [150, 200, 250, 200, 150, 100, 50, 80],
                    "fuel_total": 1180,
                    "timestamps": [
                        str(dt.datetime(2020, 12, 3)),
                        str(dt.datetime(2020, 12, 4)),
                        str(dt.datetime(2020, 12, 5)),
                        str(dt.datetime(2020, 12, 6)),
                        str(dt.datetime(2020, 12, 7)),
                        str(dt.datetime(2020, 12, 8)),
                        str(dt.datetime(2020, 12, 9)),
                        str(dt.datetime(2020, 12, 10)),
                        str(dt.datetime(2020, 12, 11)),
                    ],
                },
            ],
            "base_route": [cities["CADIZ"], cities["BOSTON"]],
            "base_fuel_step": [200, 230, 200, 260, 170, 80, 70, 50],
            "base_fuel_total": 1260,
            "boat": 0,
            "time_start": str(dt.datetime(2020, 12, 3)),
            "base_timestamps": [
                str(dt.datetime(2020, 12, 3)),
                str(dt.datetime(2020, 12, 5)),
                str(dt.datetime(2020, 12, 6)),
                str(dt.datetime(2020, 12, 7)),
                str(dt.datetime(2020, 12, 8)),
                str(dt.datetime(2020, 12, 10)),
                str(dt.datetime(2020, 12, 11)),
                str(dt.datetime(2020, 12, 12)),
                str(dt.datetime(2020, 12, 14)),
            ],
        }
        with open("static/test_data/currents.json", "r") as f:
            data["currents"] = json.loads(f.read())

        with open("static/test_data/wind.json", "r") as f:
            data["wind"] = json.loads(f.read())

        with open("static/test_data/waves.json", "r") as f:
            data["waves"] = json.loads(f.read())

    best_route = data["routes"][0]

    # Take end-time and remove microseconds
    time_end_optimized = best_route["timestamps"][-1].split(".")[0]

    optimized_elapsed_time = dt.datetime.strptime(
        time_end_optimized, "%Y-%m-%d %H:%M:%S"
    ) - dt.datetime.strptime(data["time_start"], "%Y-%m-%d %H:%M:%S")

    money_saved = int(
        (data["base"]["fuel_total"] - best_route["fuel_total"]) * FUEL_PRICE
    )
    money_color = "rgb(125,179,85)" if money_saved > 0 else "#DC143C"

    consumption_improvement = (
        1 - (best_route["fuel_total"] / data["base"]["fuel_total"])
    ) * 100
    consumption_improvement = round(consumption_improvement, 3)

    consumption_color = "rgb(125,179,85)" if consumption_improvement > 0 else "#DC143C"

    # ====== SELECT CONSUMPTION BY DAY ======
    best_index = (
        list(
            range(
                0,
                len(best_route["timestamps"]),
                math.ceil(len(best_route["timestamps"]) / 20),
            )
        )[:-1]
        + [-1]
    )
    best_timestamps = np.array(best_route["timestamps"])[best_index]
    data["indexing_routes"] = np.unique(
        np.linspace(
            0,
            len(data["routes"][0]["coords"]) - 1,
            int(len(data["routes"][0]["coords"]) / 5),
            dtype=int,
        )
    ).tolist()

    return render_template(
        "results.html",
        data=data,
        optimized_elapsed_time=str(optimized_elapsed_time),
        money_saved=f"{money_saved} €",
        money_color=money_color,
        consumption_improvement=f"{consumption_improvement} %",
        consumption_color=consumption_color,
        saved_emissions=f"{money_saved / 500. * 3:.2f} CO2 tn",
        days_best_labels=best_timestamps.tolist(),
    )


@app.errorhandler(404)
def page_not_found(error):
    return redirect("/")


@app.errorhandler(500)
def page_not_found(error):
    return '<h3>ERROR HTTP 500, internal server error</h3> <a href="/">Go back to main page</a>'


@app.errorhandler(502)
def page_not_found(error):
    return '<h3>ERROR HTTP 502, internal server error</h3> <a href="/">Go back to main page</a>'


if __name__ == "__main__":
    app.run(host="0.0.0.0")
