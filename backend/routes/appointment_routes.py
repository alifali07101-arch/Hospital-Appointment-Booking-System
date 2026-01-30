from flask import Blueprint, request, jsonify
from utils.db import mysql

appointment_bp = Blueprint('appointments', __name__)

# ================= BOOK APPOINTMENT =================
@appointment_bp.route('/book', methods=['POST'])
def book_appointment():
    try:
        data = request.json
        print("Received Booking Data:", data)
        
        if not all(k in data for k in ('patient_id', 'doctor_id', 'date', 'time')):
            return jsonify({"error": "Missing data fields"}), 400

        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status)
            VALUES (%s, %s, %s, %s, 'Scheduled')
        """, (data['patient_id'], data['doctor_id'], data['date'], data['time']))

        mysql.connection.commit()
        cur.close()

        return jsonify({"message": "Appointment Booked Successfully"}), 201
    except Exception as e:
        print("Booking SQL Error:", e)
        return jsonify({"error": str(e)}), 500

# ================= GET APPOINTMENT HISTORY =================
@appointment_bp.route('/history/<int:pid>', methods=['GET'])
def get_history(pid):
    try:
        cur = mysql.connection.cursor()
       
        cur.execute("""
            SELECT d.name, a.appointment_date, a.appointment_time, a.status
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.id
            WHERE a.patient_id = %s
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        """, (pid,))

        rows = cur.fetchall()
        cur.close()

        history = []
        for r in rows:
            history.append({
                "doctor": r[0],
                "date": str(r[1]),
                "time": str(r[2]), 
                "status": r[3]
            })

        return jsonify(history)
    except Exception as e:
        print("Fetch Error:", e)
        return jsonify({"error": "Failed to fetch history"}), 500