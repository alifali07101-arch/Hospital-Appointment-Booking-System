**🏥 HealthCare Patient Portal**
A professional Healthcare Management System designed for patients to schedule medical appointments, manage health records, and track their treatment history in real-time. This project was developed as a full-stack solution to streamline doctor-patient interactions.

✨ Key Features
Secure Authentication: Integrated Signup and Login system for patient security.

Dynamic Dashboard: Real-time stats showing Total Bookings and Upcoming Appointment counts.

Appointment Scheduling: Seamless interface to browse specialist doctors and book time slots.

History Management: Comprehensive view of all past visits with a dedicated feature to clear cancelled records for a cleaner UI.

Live Status Tracking: Instant updates on appointment status (Scheduled, Cancelled, or Completed).

User Profile: Dedicated profile section to manage personal info, including Date of Birth, Address, and Blood Group.

🛠️ Tech Stack
Frontend: HTML5, CSS3, JavaScript (Vanilla ES6).

Backend: Python (Flask Framework).

Database: MySQL.

AI Integration: Google Gemini AI (used for the college/hospital enquiry chatbot).

🚀 Installation & Setup
Clone the Repository:

Bash
git clone https://github.com/YourUsername/healthcare-portal.git
cd healthcare-portal
Install Dependencies:

Bash
pip install flask flask-mysqldb
Database Configuration:

Create a database named hospital_db in MySQL.

Create tables for patients, doctors, and appointments.

Ensure the appointments table includes appointment_date (DATE) and appointment_time (TIME) columns.

Run the Application:

Bash
python app.py
📂 Project Structure
/static: Contains CSS designs and Vanilla JS logic files.

/templates: HTML files for Dashboard, Profile, Appointments, and History.

/routes: Flask Blueprints for clean backend routing.

app.py: Main entry point for the Flask server.

👨‍💻 Developed By
Aasif

Student at Rungta International Skill University.

Specializing in Full-stack Development and AI Implementation.
