from flask import Flask, render_template, url_for

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("results.html")

@app.route("/form_example")
def form():
    return render_template("form_example.html")


if __name__ == "__main__":
    app.run(debug=True)
