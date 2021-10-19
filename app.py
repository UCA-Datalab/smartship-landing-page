from flask import Flask, render_template, url_for
import requests

app = Flask(__name__)


@app.route("/")
def index():
    response = requests.get("http://127.0.0.1:5000/api/currents/11-12-2020")
    currents = response.json()["currents"]

    return render_template("results.html", currents=currents)


if __name__ == "__main__":
    app.run(debug=True)
