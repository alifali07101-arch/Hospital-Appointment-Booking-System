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
            SELECT a.id, d.name, a.appointment_date, a.appointment_time, a.status
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
                "id": r[0],       
                "doctor": r[1],  
                "date": str(r[2]),
                "time": str(r[3]),
                "status": r[4]    
            })

        return jsonify(history)
    except Exception as e:
        print("Fetch Error:", e)
        return jsonify({"error": "Failed to fetch history"}), 500
    
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
    
@appointment_bp.route('/clear_cancelled/<int:pid>', methods=['DELETE'])
def clear_cancelled(pid):
    try:
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM appointments WHERE patient_id = %s AND status = 'Cancelled'", (pid,))
        mysql.connection.commit()
        deleted_count = cur.rowcount 
        cur.close()
        
        return jsonify({
            "message": f"History cleared! {deleted_count} cancelled appointments removed.",
            "count": deleted_count
        }), 200
    except Exception as e:
        print("Clear Error:", e)
        return jsonify({"error": str(e)}), 500