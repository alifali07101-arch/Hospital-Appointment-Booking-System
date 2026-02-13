from flask import Blueprint, jsonify, request
from utils.db import mysql

patient_bp = Blueprint('patient_bp', __name__)

# ================= GET PROFILE =================
@patient_bp.route('/profile/<int:pid>', methods=['GET'])
def get_profile(pid):
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT full_name, email, phone, dob, blood_group, address
        FROM patients WHERE id=%s
    """, (pid,))
    p = cur.fetchone()
    cur.close()

    if not p:
        return jsonify({"error": "Patient not found"}), 404

    return jsonify({
        "full_name": p[0],
        "email": p[1],
        "phone": p[2],
        "dob": str(p[3]) if p[3] else None,
        "blood_group": p[4],
        "address": p[5]
    })


@patient_bp.route('/update/<int:pid>', methods=['PUT'])
def update_profile(pid):
    data = request.json

    cur = mysql.connection.cursor()
    cur.execute("""
        UPDATE patients 
        SET phone=%s, dob=%s, blood_group=%s, address=%s
        WHERE id=%s
    """, (
        data.get('phone'),
        data.get('dob'),
        data.get('blood_group'),
        data.get('address'),
        pid
    ))
    mysql.connection.commit()
    cur.close()

    return jsonify({"message": "Profile updated successfully"})
