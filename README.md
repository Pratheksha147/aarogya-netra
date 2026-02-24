🚑 Aarogya-Netra
AI-Powered Patient Feedback Intelligence & Automated Service Recovery Platform

Transforming patient feedback into real-time, actionable healthcare improvement.

📌 Overview

Aarogya-Netra is an AI-driven Patient Experience Analytics & Automated Service Recovery System that helps hospitals:

Centralize multi-channel patient feedback

Detect negative sentiment spikes early

Classify recurring operational issues

Automatically generate service recovery cases

Track SLA-based accountability

Measure measurable impact after resolution

🧠 Problem Statement

Hospitals receive feedback from:

WhatsApp

Emails

Call center logs

Online reviews

Internal reports

But:

Feedback is scattered

Analysis is manual

No real-time intelligence

No automatic accountability

This leads to delayed response and declining patient satisfaction.

💡 Our Solution

Aarogya-Netra provides:

✅ Unified feedback gateway
✅ AI-powered sentiment analysis (VADER)
✅ ML-based issue classification (SVM)
✅ TF-IDF feature extraction
✅ Automated case generation
✅ SLA tracking
✅ Executive analytics dashboard

🏗️ System Architecture
Patient / Staff
      ↓
WhatsApp / Email
      ↓
Flask REST API
      ↓
AI Layer (TF-IDF + SVM + VADER)
      ↓
MySQL Database
      ↓
React + TypeScript Dashboard
🧩 Tech Stack
🔹 Frontend

React

TypeScript

Axios (API integration)

Chart.js

CSS / Tailwind

🔹 Backend

Python

Flask

MySQL Connector

🔹 AI / Machine Learning

TF-IDF (Text Feature Extraction)

Support Vector Machine (SVM) – Issue Classification

VADER – Sentiment Analysis

Scikit-learn

Pandas / NumPy

🔹 Database

MySQL

🔹 Integrations

Twilio WhatsApp API

IMAP (Email Listener)

SMTP (Alerts)

⚙️ How It Works
1️⃣ Feedback Collection

All incoming feedback (WhatsApp / Email) is normalized into:

{
  "source": "",
  "department": "",
  "text": "",
  "timestamp": ""
}
2️⃣ AI Processing
✔ Preprocessing

Lowercasing

Cleaning text

Removing noise

✔ TF-IDF

Converts text into numerical vectors.

✔ SVM Classification

Classifies issue category:

Waiting Time

Billing

Staff Behaviour

Facilities

✔ VADER Sentiment

Outputs:

Positive

Neutral

Negative

Compound score

3️⃣ Automated Service Recovery

If:

Sentiment = Negative

Sentiment spike detected

System:

Auto-creates service case

Assigns department

Starts SLA timer

Tracks resolution

Case Flow:

Open → In Progress → Resolved
📊 Dashboard Modules
Department View

Assigned cases

SLA countdown

Update status

Add resolution notes

Executive View

Overall sentiment trends

Department-wise heatmap

Active alerts

SLA compliance metrics

Before vs After sentiment comparison

🚀 Project Structure
aarogya-netra/
│
├── backend/
│   ├── app.py
│   ├── ai_pipeline.py
│   ├── email_listener.py
│   ├── whatsapp_webhook.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── package.json
│
└── README.md
🖥️ How To Run The Project
🔹 Backend Setup
1️⃣ Navigate to backend
cd backend
2️⃣ Create virtual environment
python -m venv venv
venv\Scripts\activate
3️⃣ Install dependencies
pip install -r requirements.txt
4️⃣ Configure Environment Variables

Create .env file:

DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
EMAIL_USER=
EMAIL_PASS=
5️⃣ Run Flask Server
python app.py

Backend runs on:

http://localhost:5000
🔹 Frontend Setup
1️⃣ Navigate to frontend
cd frontend
2️⃣ Install dependencies
npm install
3️⃣ Start React server
npm start

Frontend runs on:

http://localhost:8080
📈 Key Innovations

🔹 Real-time WhatsApp ingestion
🔹 Unified email-based feedback gateway
🔹 ML-driven issue classification
🔹 Sentiment spike early-warning
🔹 Automated SLA enforcement
🔹 Closed-loop measurable impact

🏥 Vision

To convert scattered patient feedback into
structured, AI-powered healthcare improvement intelligence.
