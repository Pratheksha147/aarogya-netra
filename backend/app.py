import os
import joblib
import mysql.connector
from flask import Flask, request
from twilio.rest import Client
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from dotenv import load_dotenv
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
import threading
import time
from email_reader import check_emails

load_dotenv()
app = Flask(__name__)
CORS(app)
# ==========================
# 🔐 Twilio Configuration
# ==========================
account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
twilio_number = "whatsapp:+14155238886"
client = Client(account_sid, auth_token)

# ==========================
# 🤖 AI Components
# ==========================
analyzer = SentimentIntensityAnalyzer()

try:
    department_model = joblib.load("department_model.pkl")
    print("✅ Department model loaded successfully")
except:
    department_model = None

# ==========================
# 🗄 Database Connection
# ==========================
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Pratheksha@2007",
        database="careloop"
    )

# ==========================
# 🏥 Hospital Name
# ==========================
def get_hospital_name(cursor):
    cursor.execute("SELECT hospital_name FROM hospitals ORDER BY id DESC LIMIT 1")
    result = cursor.fetchone()
    return result["hospital_name"] if result else "Our Hospital"

# ==========================
# 🏥 Department Detection
# ==========================
def detect_department(message):
    if department_model:
        try:
            prediction = department_model.predict([message])
            return prediction[0]
        except:
            return "General Services"
    return "General Services"

# ==========================
# 🕒 SLA Deadline Calculation
# ==========================
def calculate_sla_deadline(cursor, department):
    cursor.execute("SELECT sla_hours FROM sla_rules WHERE department=%s", (department,))
    result = cursor.fetchone()
    sla_hours = result["sla_hours"] if result else 24
    return datetime.now() + timedelta(hours=sla_hours)

# ==========================
# 🚨 SLA Breach Engine
# ==========================
def check_and_update_breaches(cursor):
    now = datetime.now()

    cursor.execute("""
        SELECT id, department, sla_deadline
        FROM service_cases
        WHERE status != 'Resolved' AND is_breached=FALSE

    """)

    cases = cursor.fetchall()

    for case in cases:
        if case["sla_deadline"] and now > case["sla_deadline"]:

            # Mark breached
            cursor.execute("""
                UPDATE service_cases
                SET is_breached=TRUE
                WHERE id=%s
            """, (case["id"],))

            # Create alert
            cursor.execute("""
                INSERT INTO alerts (case_id, alert_type, message)
                VALUES (%s, %s, %s)
            """, (
                case["id"],
                "SLA_BREACH",
                f"SLA breached for {case['department']} case ID {case['id']}"
            ))

# ==========================
# 📩 WhatsApp Webhook
# ==========================
@app.route('/whatsapp-webhook', methods=['POST'])
def whatsapp_webhook():

    sender = request.form.get('From')
    message = request.form.get('Body')

    if not message:
        return "No message received", 400

    message = message.strip()
    lower_msg = message.lower()

    # Ignore polite endings
    if any(word in lower_msg for word in ["thank", "thanks", "ok", "okay", "fine", "great", "cool"]):
        return "OK", 200

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    try:

        # Run SLA breach engine every request
        check_and_update_breaches(cursor)
        db.commit()

        cursor.execute("SELECT stage FROM conversation_state WHERE mobile=%s", (sender,))
        result = cursor.fetchone()
        current_stage = result["stage"] if result else None

        # -------------------------
        # Greeting / Reset
        # -------------------------
        if lower_msg in ["hi", "hello", "menu", "start"]:

            hospital_name = get_hospital_name(cursor)

            cursor.execute("""
                INSERT INTO conversation_state (mobile, stage)
                VALUES (%s, %s)
                ON DUPLICATE KEY UPDATE stage=%s
            """, (sender, "waiting_for_option", "waiting_for_option"))
            db.commit()

            reply = (
                f"Welcome to {hospital_name} Careloop 🤖\n\n"
                "1️⃣ Submit a Complaint\n"
                "2️⃣ Provide Feedback\n"
                "3️⃣ General Enquiry\n\n"
                "Reply with 1, 2 or 3."
            )

        # -------------------------
        # Menu Stage
        # -------------------------
        elif current_stage == "waiting_for_option":

            if message == "1":
                cursor.execute(
                    "UPDATE conversation_state SET stage=%s WHERE mobile=%s",
                    ("waiting_for_complaint", sender)
                )
                db.commit()
                reply = "Please describe your complaint in detail."

            elif message == "2":
                cursor.execute(
                    "UPDATE conversation_state SET stage=%s WHERE mobile=%s",
                    ("waiting_for_feedback", sender)
                )
                db.commit()
                reply = "Please share your feedback."

            elif message == "3":
                reply = "For general enquiries, contact reception at 044-XXXXXXX."

            else:
                reply = "Invalid option. Please reply with 1, 2 or 3."

        # -------------------------
        # Complaint Mode
        # -------------------------
        elif current_stage == "waiting_for_complaint":

            sentiment = analyzer.polarity_scores(message)['compound']
            department = detect_department(message)

            # Insert feedback
            cursor.execute("""
                INSERT INTO feedback
                (source, mobile, department, subject, message, sentiment)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                "WhatsApp",
                sender,
                department,
                None,
                message,
                sentiment
            ))
            db.commit()

            feedback_id = cursor.lastrowid

            # Negative → create SLA case
            # Any negative sentiment → create case
            if sentiment < 0:

                deadline = calculate_sla_deadline(cursor, department)

                cursor.execute("""
                    INSERT INTO service_cases
                    (feedback_id, department, status, sla_deadline)
                    VALUES (%s, %s, %s, %s)
                """, (
                    feedback_id,
                    department,
                    "Open",
                    deadline
                ))
                db.commit()

                reply = (
                    f"We sincerely apologize for the inconvenience in our {department} department.\n"
                    "A service case has been created and assigned for immediate attention.\n"
                    f"SLA Deadline: {deadline.strftime('%Y-%m-%d %H:%M')}"
                )
            else:
                reply = "Thank you for your feedback."

            reply += "\n\nYou may continue or type 'menu' to return."

        # -------------------------
        # Feedback Mode
        # -------------------------
        elif current_stage == "waiting_for_feedback":

            sentiment = analyzer.polarity_scores(message)['compound']
            department = detect_department(message)

            cursor.execute("""
                INSERT INTO feedback
                (source, mobile, department, subject, message, sentiment)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                "WhatsApp",
                sender,
                department,
                None,
                message,
                sentiment
            ))
            db.commit()

            reply = "Thank you for your valuable feedback."

        else:
            reply = "Please type 'menu' to restart."

        # Safe Twilio send (won't crash on limit)
        try:
            client.messages.create(
                body=reply,
                from_=twilio_number,
                to=sender
            )
        except Exception as e:
            print("Twilio send failed:", str(e))

        return "OK", 200

    except Exception as e:
        print("Server Error:", str(e))
        return "Internal Server Error", 500

    finally:
        cursor.close()
        db.close()
        # -------------------------
        # Feedback API
        # -------------------------
@app.route('/api/feedback', methods=['GET'])
def get_feedback():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, source, department, message, sentiment
        FROM feedback
        ORDER BY id DESC
    """)

    feedback = cursor.fetchall()

    # Replace None sentiment with 0
    for f in feedback:
        if f["sentiment"] is None:
            f["sentiment"] = 0

    total = len(feedback)
    positive = len([f for f in feedback if f["sentiment"] > 0])
    negative = len([f for f in feedback if f["sentiment"] < 0])
    neutral = total - positive - negative

    cursor.close()
    db.close()

    return jsonify({
        "total": total,
        "positive": positive,
        "negative": negative,
        "neutral": neutral,
        "data": feedback
    })

        # -------------------------
        # Service Case API
        # -------------------------

@app.route('/api/service-cases', methods=['GET'])
def get_service_cases():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, department, status, sla_deadline, is_breached
        FROM service_cases
        ORDER BY id DESC
    """)

    cases = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(cases)

@app.route("/api/cases", methods=["GET"])
def get_cases():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT id,
               feedback_id,
               department,
               status,
               sla_deadline,
               is_breached
        FROM service_cases
        ORDER BY id DESC
    """)

    cases = cursor.fetchall()

    total = len(cases)
    open_cases = len([c for c in cases if c["status"] == "Open"])
    in_progress = len([c for c in cases if c["status"] == "In Progress"])
    resolved = len([c for c in cases if c["status"] == "Resolved"])
    breached = len([c for c in cases if c["is_breached"] == 1])

    cursor.close()
    db.close()

    return {
        "total": total,
        "open": open_cases,
        "in_progress": in_progress,
        "resolved": resolved,
        "breached": breached,
        "data": cases
    }

@app.route("/api/cases/<int:case_id>", methods=["PUT"])
def update_case_status(case_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    data = request.get_json()
    new_status = data.get("status")

    if new_status == "Resolved":
        cursor.execute("""
            UPDATE service_cases
            SET status=%s,
                resolved_at=NOW()
            WHERE id=%s
        """, (new_status, case_id))
    else:
        cursor.execute("""
            UPDATE service_cases
            SET status=%s
            WHERE id=%s
        """, (new_status, case_id))

    db.commit()
    cursor.close()
    db.close()

    return jsonify({"message": "Status updated"})
# ==========================
# 📊 Admin Analytics API
# ==========================
# ==========================
# 📊 Admin Analytics API (FULLY SAFE VERSION)
# ==========================
@app.route("/api/admin-analytics", methods=["GET"])
def admin_analytics():

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        check_and_update_breaches(cursor)
        db.commit()

        # -------------------
        # TOTAL FEEDBACK
        # -------------------
        cursor.execute("SELECT COUNT(*) AS total FROM feedback")
        total_feedback = cursor.fetchone()["total"] or 0

        # -------------------
        # NEGATIVE %
        # -------------------
        cursor.execute("""
            SELECT 
            IFNULL(
                (SUM(CASE WHEN sentiment < -0.05 THEN 1 ELSE 0 END) 
                / NULLIF(COUNT(*),0)) * 100, 0
            ) AS negative_percent
            FROM feedback
        """)
        negative_percent = round(cursor.fetchone()["negative_percent"] or 0, 2)

        # -------------------
        # ACTIVE CASES
        # -------------------
        cursor.execute("""
            SELECT COUNT(*) AS active_cases
            FROM service_cases
            WHERE status != 'Resolved'
        """)
        active_cases = cursor.fetchone()["active_cases"] or 0

        # -------------------
        # BREACHES
        # -------------------
        cursor.execute("""
            SELECT COUNT(*) AS breaches
            FROM service_cases
            WHERE is_breached = TRUE
        """)
        breaches = cursor.fetchone()["breaches"] or 0

        # -------------------
        # SENTIMENT DISTRIBUTION (SAFE)
        # -------------------
        cursor.execute("""
            SELECT
            IFNULL(SUM(CASE WHEN sentiment > 0.05 THEN 1 ELSE 0 END),0) AS positive,
            IFNULL(SUM(CASE WHEN sentiment BETWEEN -0.05 AND 0.05 THEN 1 ELSE 0 END),0) AS neutral,
            IFNULL(SUM(CASE WHEN sentiment < -0.05 THEN 1 ELSE 0 END),0) AS negative
            FROM feedback
        """)
        sentiment_distribution = cursor.fetchone()

        # Guarantee pie renders
        if (
            sentiment_distribution["positive"] +
            sentiment_distribution["neutral"] +
            sentiment_distribution["negative"]
        ) == 0:
            sentiment_distribution = {
                "positive": 1,
                "neutral": 0,
                "negative": 0
            }

        # -------------------
        # DEPARTMENT ISSUES
        # -------------------
        cursor.execute("""
            SELECT department,
                   COUNT(*) AS total,
                   SUM(CASE WHEN status='Resolved' THEN 1 ELSE 0 END) AS resolved
            FROM service_cases
            GROUP BY department
        """)
        department_data = cursor.fetchall() or []

        # -------------------
        # SENTIMENT TREND
        # -------------------
        cursor.execute("""
            SELECT DATE(created_at) AS date,
                   SUM(CASE WHEN sentiment > 0.05 THEN 1 ELSE 0 END) AS positive,
                   SUM(CASE WHEN sentiment < -0.05 THEN 1 ELSE 0 END) AS negative
            FROM feedback
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at)
        """)
        sentiment_trend = cursor.fetchall() or []

        # -------------------
        # DAILY NEGATIVE
        # -------------------
        cursor.execute("""
            SELECT DATE(created_at) AS date,
                   COUNT(*) AS count
            FROM feedback
            WHERE sentiment < -0.05
            AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at)
        """)
        daily_negative = cursor.fetchall() or []

        # -------------------
        # TOP CATEGORIES
        # -------------------
        cursor.execute("""
            SELECT department, COUNT(*) AS count
            FROM feedback
            WHERE sentiment < -0.05
            GROUP BY department
            ORDER BY count DESC
            LIMIT 5
        """)
        top_categories = cursor.fetchall() or []

        cursor.close()
        db.close()

        return jsonify({
            "total_feedback": total_feedback,
            "negative_percent": negative_percent,
            "active_cases": active_cases,
            "breaches": breaches,
            "sentiment_distribution": sentiment_distribution,
            "departments": department_data,
            "sentiment_trend": sentiment_trend,
            "daily_negative": daily_negative,
            "top_categories": top_categories
        })

    except Exception as e:
        print("ADMIN ANALYTICS ERROR:", str(e))
        return jsonify({"error": str(e)}), 500
    # ==========================
# 🏥 Add Patient
# ==========================
@app.route("/api/patients", methods=["POST"])
def add_patient():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data received"}), 400

        db = get_db_connection()
        cursor = db.cursor()

        cursor.execute("""
            INSERT INTO patients
            (name, age, gender, phone, guardian_name, guardian_phone, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            data.get("name"),
            int(data.get("age")),
            data.get("gender"),
            data.get("phone"),
            data.get("guardian_name"),
            data.get("guardian_phone"),
            "Active"
        ))

        db.commit()
        cursor.close()
        db.close()

        return jsonify({"message": "Patient added successfully"}), 200

    except Exception as e:
        print("ADD PATIENT ERROR:", str(e))  # VERY IMPORTANT
        return jsonify({"error": str(e)}), 500


# ==========================
# 🏥 Get All Patients
# ==========================
@app.route("/api/patients", methods=["GET"])
def get_patients():
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        cursor.execute("SELECT * FROM patients ORDER BY id DESC")
        patients = cursor.fetchall()

        cursor.close()
        db.close()

        return jsonify(patients)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==========================
# 🏥 Update Patient Status
# ==========================
@app.route("/api/patients/<int:patient_id>", methods=["PUT"])
def update_patient_status(patient_id):
    try:
        data = request.get_json()
        new_status = data.get("status")

        db = get_db_connection()
        cursor = db.cursor()

        cursor.execute("""
            UPDATE patients
            SET status=%s
            WHERE id=%s
        """, (new_status, patient_id))

        db.commit()
        cursor.close()
        db.close()

        return jsonify({"message": "Status updated successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    # ==========================
# 📊 Dashboard Summary API
# ==========================
@app.route("/api/dashboard-summary", methods=["GET"])
def dashboard_summary():
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        # Total Feedback
        cursor.execute("SELECT COUNT(*) AS total FROM feedback")
        total_feedback = cursor.fetchone()["total"] or 0

        # Active Patients
        cursor.execute("""
            SELECT COUNT(*) AS active_patients
            FROM patients
            WHERE status = 'Active'
        """)
        active_patients = cursor.fetchone()["active_patients"] or 0

        # Open Cases
        cursor.execute("""
            SELECT COUNT(*) AS open_cases
            FROM service_cases
            WHERE status != 'Resolved'
        """)
        open_cases = cursor.fetchone()["open_cases"] or 0

        # SLA Breaches
        cursor.execute("""
            SELECT COUNT(*) AS breaches
            FROM service_cases
            WHERE is_breached = TRUE
        """)
        breaches = cursor.fetchone()["breaches"] or 0

        cursor.close()
        db.close()

        return jsonify({
            "total_feedback": total_feedback,
            "active_patients": active_patients,
            "open_cases": open_cases,
            "breaches": breaches
        })

    except Exception as e:
        print("DASHBOARD ERROR:", str(e))
        return jsonify({"error": str(e)}), 500
# ==========================
# 📡 BACKGROUND EMAIL LISTENER
# ==========================

def run_email_listener():
    while True:
        try:
            check_emails()
            time.sleep(60)  # check every 60 seconds
        except Exception as e:
            print("Email Listener Error:", e)


if __name__ == '__main__':

    # Prevent double thread in debug mode
    if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
        email_thread = threading.Thread(target=run_email_listener)
        email_thread.daemon = True
        email_thread.start()

    app.run(port=5000, debug=True)
     
   
    