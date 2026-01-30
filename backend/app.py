from flask import Flask, render_template
from flask_cors import CORS
from utils.db import mysql
import config

app = Flask(__name__)
CORS(app)

# ================= DATABASE =================
app.config['MYSQL_HOST'] = config.MYSQL_HOST
app.config['MYSQL_USER'] = config.MYSQL_USER
app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
app.config['MYSQL_DB'] = config.MYSQL_DB

mysql.init_app(app)

# ================= API ROUTES =================
from routes.auth_routes import auth_bp
from routes.doctor_routes import doctor_bp
from routes.appointment_routes import appointment_bp
from routes.patient_routes import patient_bp

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(doctor_bp, url_prefix="/api/doctors")
app.register_blueprint(appointment_bp, url_prefix="/api/appointments")
app.register_blueprint(patient_bp, url_prefix="/api/patient")



# ================= FRONTEND PAGE ROUTES =================
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/login")
def login_page():
    return render_template("login.html")

@app.route("/signup")
def signup_page():
    return render_template("signup.html")

@app.route("/dashboard")
def dashboard_page():
    return render_template("dashboard.html")

@app.route("/doctors-page")
def doctors_page():
    return render_template("doctors.html")

@app.route("/book")
def book_page():
    return render_template("book-appointment.html")

@app.route("/appointments")
def appointments_page():
    return render_template("appointments.html")

@app.route("/history-page")
def history_page():
    return render_template("history.html")

@app.route("/profile")
def profile_page():
    return render_template("profile.html")


# ================= RUN SERVER =================
if __name__ == "__main__":
    app.run(debug=True)
