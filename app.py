from flask import Flask, render_template, request
import requests
from requests.api import options

app = Flask(__name__)


@app.route("/")
def index():
    response = requests.get("http://localhost:5000/api/available_routes/dummy")
    code = response.status_code
    if code == 200:
        city_options = {
            f"{cities['start_city']}-{cities['start_city']}": [
                cities["start_city"],
                cities["start_city"],
            ]
            for cities in response.json()
        }
    else:
        city_options = {
            "CADIZ-BOSTON": ["CADIZ", "BOSTON"],
            "BOSTON-CADIZ": ["BOSTON", "CADIZ"],
            "CARACAS-DAKAR": ["CARACAS", "DAKAR"],
            "DAKAR-CARACAS": ["DAKAR", "CARACAS"],
        }

    return render_template("form.html", city_options=city_options)


@app.route("/results", methods=["GET", "POST"])
def results():
    return render_template("results.html")


if __name__ == "__main__":
    app.run(debug=True, port=5001)
