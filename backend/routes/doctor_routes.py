from flask import Blueprint, jsonify
from utils.db import mysql

doctor_bp = Blueprint('doctor_bp', __name__)

@doctor_bp.route('/', methods=['GET'])
def get_doctors():
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT id, name, specialization, experience, degree, fees, image 
            FROM doctors
        """)
        rows = cur.fetchall()
        cur.close()

        doctors = []
        for row in rows:
            doctors.append({
                "id": row[0],
                "name": row[1],
                "specialization": row[2],
                "experience": row[3],
                "degree": row[4],
                "fees": row[5],
                "image": row[6]
            })

        return jsonify(doctors)

    except Exception as e:
        print("ERROR FETCHING DOCTORS:", e)
        return jsonify({"error": "Failed to fetch doctors"}), 500
