from flask import (
    Flask,
    flash,
    render_template,
    request,
    redirect
)
from flask_mail import(
    Mail,
    Message,
) 

import datetime as dt
import numpy as np


app = Flask(__name__)
app.secret_key = "12345678987654321#"

#define the mail configuration parameters
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'smartshipping.contact@gmail.com'
app.config['MAIL_PASSWORD'] = 'smartship1234'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

#Create an instance of the mail class
mail = Mail(app)



#APP variables
# Price $/mt, no estoy seguro de que esta sea la medida correcta
FUEL_PRICE = 633.50

cities = {
    "CADIZ": [36.545344, -6.279833],
    "BOSTON": [42.380193, -70.705909],
    "DAKAR": [14.692417, -17.525908],
    "CARACAS": [10.625383, -66.941741],
}

PORT_START = ['Charleston','Bahamas']
DATES = ['2021-01-01']

@app.route("/")
def index():
    
    return render_template("landing.html")



@app.route("/demo_request", methods=["GET", "POST"])
def demo_request():

    name = request.form['name']
    email = request.form['mail']
    phone = request.form['phone']
    company = request.form['company']
    message = request.form['msg']

    msg = Message(f"Request from {name}", sender = 'smartshipping.contact@gmail.com', recipients = ['smartshipping.contact@gmail.com'])
    msg.body = f"Demo request:\n \
            Name:{name} \n \
            Mail: {email}\n \
            Phone number: {phone}\n \
            Company: {company}\n \
            Message:\n {message}"
    
    mail.send(msg)
    flash("Your message was successfully sent")
    return redirect('/')



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
    app.run(host="0.0.0.0", port=5000)
