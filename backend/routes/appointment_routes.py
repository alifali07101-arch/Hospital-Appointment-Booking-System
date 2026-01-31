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
# ================= GET APPOINTMENT HISTORY =================
@appointment_bp.route('/history/<int:pid>', methods=['GET'])
def get_history(pid):
    try:
        cur = mysql.connection.cursor()
       
        cur.execute("""
            SELECT a.id, d.name, a.appointment_date, a.appointment_time, a.status
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.id
            WHERE a.patient_id = %s
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        """, (pid,)) # 1. SQL mein 'a.id' add kiya

        rows = cur.fetchall()
        cur.close()

        history = []
        for r in rows:
            history.append({
                "id": r[0],       # 2. JSON mein "id" key add ki
                "doctor": r[1],   # Ab index 1 par name hai
                "date": str(r[2]),# Ab index 2 par date hai
                "time": str(r[3]),# Ab index 3 par time hai
                "status": r[4]    # Ab index 4 par status hai
            })

        return jsonify(history)
    except Exception as e:
        print("Fetch Error:", e)
        return jsonify({"error": "Failed to fetch history"}), 500
    
    # appointment_routes.py mein add karein
@appointment_bp.route('/cancel/<int:aid>', methods=['PUT'])
def cancel_appointment(aid):
    try:
        cur = mysql.connection.cursor()
        cur.execute("UPDATE appointments SET status = 'Cancelled' WHERE id = %s", (aid,))
        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "Appointment Cancelled"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    # appointment_routes.py mein ye function add karein
@appointment_bp.route('/clear_cancelled/<int:pid>', methods=['DELETE'])
def clear_cancelled(pid):
    try:
        cur = mysql.connection.cursor()
        # Sirf wahi appointments delete honge jo is patient ke hain aur Cancelled hain
        cur.execute("DELETE FROM appointments WHERE patient_id = %s AND status = 'Cancelled'", (pid,))
        mysql.connection.commit()
        deleted_count = cur.rowcount # Kitne records delete hue
        cur.close()
        
        return jsonify({
            "message": f"History cleared! {deleted_count} cancelled appointments removed.",
            "count": deleted_count
        }), 200
    except Exception as e:
        print("Clear Error:", e)
        return jsonify({"error": str(e)}), 500