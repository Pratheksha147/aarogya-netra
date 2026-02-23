import imaplib
import email
from email.header import decode_header
import mysql.connector
from textblob import TextBlob
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv() 

def check_emails():
    print("📡 Email Listener Running...")

    # ==========================
    # 🔐 EMAIL CREDENTIALS
    # ==========================
    EMAIL = os.getenv("EMAIL_USER")
    APP_PASSWORD = os.getenv("EMAIL_PASS")   # Replace with Gmail App Password

    # ==========================
    # 🔐 DATABASE CONNECTION
    # ==========================
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Pratheksha@2007",   # Replace with your MySQL password
        database="careloop"
    )

    cursor = db.cursor()

    try:
        # ==========================
        # 📩 CONNECT TO GMAIL
        # ==========================
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(EMAIL, APP_PASSWORD)
        mail.select("inbox")

        status, messages = mail.search(None, 'UNSEEN')
        mail_ids = messages[0].split()

        print("📨 Unread Emails Found:", len(mail_ids))

        for mail_id in mail_ids:
            status, msg_data = mail.fetch(mail_id, "(RFC822)")

            for response_part in msg_data:
                if isinstance(response_part, tuple):

                    msg = email.message_from_bytes(response_part[1])

                    # ==========================
                    # 📌 SUBJECT
                    # ==========================
                    subject, encoding = decode_header(msg["Subject"])[0]
                    if isinstance(subject, bytes):
                        subject = subject.decode(encoding if encoding else "utf-8")

                    # ==========================
                    # 📌 BODY EXTRACTION
                    # ==========================
                    body = ""

                    if msg.is_multipart():
                        for part in msg.walk():
                            if part.get_content_type() == "text/plain":
                                body = part.get_payload(decode=True).decode(errors="ignore")
                                break
                    else:
                        body = msg.get_payload(decode=True).decode(errors="ignore")

                    print("📩 Subject:", subject)
                    print("📝 Body:", body)

                    # ==========================
                    # 🤖 SENTIMENT ANALYSIS
                    # ==========================
                    analysis = TextBlob(body)
                    sentiment_score = analysis.sentiment.polarity

                    print("📊 Sentiment Score:", sentiment_score)

                    # ==========================
                    # 💾 INSERT INTO FEEDBACK TABLE
                    # ==========================
                    insert_feedback = """
                        INSERT INTO feedback
                        (source, department, subject, message, sentiment)
                        VALUES (%s, %s, %s, %s, %s)
                    """

                    values = (
                        "Email",
                        "General",
                        subject,
                        body,
                        sentiment_score
                    )

                    cursor.execute(insert_feedback, values)
                    db.commit()

                    feedback_id = cursor.lastrowid

                    print("✅ Feedback inserted successfully")

                    # ==========================
                    # 🚨 AUTO CREATE SERVICE CASE IF NEGATIVE
                    # ==========================
                    if sentiment_score < 0:

                        deadline = datetime.now() + timedelta(hours=24)

                        insert_case = """
                            INSERT INTO service_cases
                            (feedback_id, department, status, sla_deadline)
                            VALUES (%s, %s, %s, %s)
                        """

                        cursor.execute(insert_case, (
                            feedback_id,
                            "General",
                            "Open",
                            deadline
                        ))

                        db.commit()

                        print("🚨 Service case auto-created")

                    # ==========================
                    # ✅ MARK EMAIL AS READ
                    # ==========================
                    mail.store(mail_id, '+FLAGS', '\\Seen')

        mail.logout()

    except Exception as e:
        print("❌ Email Listener Error:", e)

    finally:
        cursor.close()
        db.close()