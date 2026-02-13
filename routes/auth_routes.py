from flask import Blueprint, request, jsonify
from utils.db import mysql

from auth_helpers import hash_password, check_password 

auth_bp = Blueprint('auth', __name__)

# ================= SIGNUP ROUTE =================
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    name = data.get('full_name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')
    dob = data.get('dob')
    blood = data.get('blood_group')
    address = data.get('address')

    hashed_pw = hash_password(password)

    cur = mysql.connection.cursor()
    
    cur.execute("SELECT id FROM patients WHERE email=%s", (email,))
    if cur.fetchone():
        cur.close()
        return jsonify({"message": "Email already exists"}), 400

    try:
        cur.execute("""
            INSERT INTO patients (full_name, email, password, phone, dob, blood_group, address) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (name, email, hashed_pw, phone, dob, blood, address))
        
        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "Signup successful! Please Login."}), 201
    except Exception as e:
        print("Signup Error:", e)
        return jsonify({"message": "Error saving data"}), 500
# ================= LOGIN ROUTE =================
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        cur = mysql.connection.cursor()
        
        cur.execute("SELECT id, password, full_name FROM patients WHERE email=%s", (email,))
        user = cur.fetchone()
        cur.close()

        if user:
            
            if check_password(password, user[1]):
                
                return jsonify({
                    "message": "Login success", 
                    "patientId": user[0],
                    "name": user[2]
                }), 200
            else:
                return jsonify({"message": "Password was wrong!"}), 401

        return jsonify({"message": "User not found signup please!"}), 404

    except Exception as e:
        print("Login Error:", e)
        return jsonify({"message": "Server error"}), 500