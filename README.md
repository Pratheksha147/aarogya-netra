🚑 Aarogya-Netra
AI-Driven Patient Feedback & Automated Service Recovery Platform

Track: Care & Cure (Track 3)
Team: Dev 404 Crew
Impact-AI-THON 2026

📌 Problem Statement

Hospitals collect patient feedback from multiple sources such as:

Google Reviews

Call Centers

Social Media

Surveys

Internal Reports

However, this feedback:

Is scattered across platforms

Is manually analyzed

Lacks real-time intelligence

Does not trigger immediate service recovery

This leads to:

Delayed issue resolution

Poor patient experience

Financial & reputational loss

Reduced patient trust

💡 Solution Overview

Aarogya-Netra is an AI-driven Patient Experience Analytics & Automated Service Recovery Platform.

It:

Unifies multi-channel feedback into one intelligent system

Applies AI-based sentiment analysis

Detects issue patterns across departments

Automatically triggers service recovery workflows

Tracks SLA compliance

Measures impact before and after intervention

🔁 Complete Workflow
🔹 Phase 1 – Hospital Onboarding

Hospital registers on platform

Departments configured (OPD, Billing, Nursing, etc.)

SLA rules defined

System generates:

Hospital ID

Dedicated feedback email

WhatsApp feedback number

🔹 Phase 2 – Real-Time Feedback Collection
1️⃣ WhatsApp-Based Feedback

Patient sends message via WhatsApp

Message → Twilio Webhook → Flask API → Database

Stored with timestamp & department

2️⃣ Email-Based Unified Feedback

PR / Call Center / Social Team sends structured email

Email Listener extracts:

Source

Department

Feedback text

Stored in unified format

🔹 Phase 3 – Unified Data Pipeline

All feedback converted into a common structure:

{
  "source": "",
  "department": "",
  "text": "",
  "timestamp": ""
}

From here, source differences disappear.
The system works on one unified feedback stream.

🔹 Phase 4 – AI Processing
✔ Preprocessing

Remove sensitive data (PII)

Lowercasing

Stopword removal

✔ Sentiment Analysis

VADER / BERT

Sentiment score tracking

Trend monitoring

✔ Issue Clustering

TF-IDF + KMeans

Groups similar complaints

Detects systemic issues

✔ Spike Detection

Moving average logic

Automatic negative sentiment surge alerts

🔹 Phase 5 – Automated Service Recovery

Negative feedback auto-creates a service case

Department assigned

SLA timer starts

Case flow:

Open → In Progress → Resolved
🔹 Phase 6 – Closed Loop Communication

WhatsApp auto-acknowledgement

Call follow-up logging

PR response tracking

Resolution tracked even if direct reply not possible

🔹 Phase 7 – Executive Analytics Dashboard

Displays:

Overall patient sentiment

Department-wise heatmap

Active alerts

SLA compliance

Sentiment before vs after intervention

🧩 Tech Stack
🔹 Frontend

HTML5

CSS3

JavaScript (Vanilla JS)

Chart.js

Fetch API

Pages:

Login

Department Dashboard

Case Management

Executive Dashboard

🔹 Backend

Python

Flask

Flask-JWT (Authentication)

SQLAlchemy

🔹 Database

MySQL / SQL Server

Main Tables:

hospitals

departments

users

feedback

issues

service_cases

alerts

sentiment_logs

🔹 AI & NLP

NLTK / spaCy

Scikit-learn

VADER

TF-IDF

KMeans

Logistic Regression

BERT / Sentence Transformers

🔹 Integrations

Twilio WhatsApp API

Gmail IMAP (Email Listener)

SMTP Alerts

🚀 Installation Guide
1️⃣ Clone Repository
git clone <your-repo-url>
cd aarogya-netra
2️⃣ Backend Setup
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

Create .env file:

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
EMAIL_USER=
EMAIL_PASS=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=

Run:

python app.py
3️⃣ Frontend

Open index.html
Or use Live Server in VS Code

📊 Key Features

✅ Real-time feedback ingestion
✅ Source-agnostic AI intelligence
✅ Automatic case creation
✅ SLA tracking
✅ Spike detection
✅ Closed-loop resolution
✅ Impact measurement
✅ Executive analytics

🎯 Innovation Highlights

Email-based unified gateway (no scraping required)

Cross-channel issue clustering

24–48 hour negative sentiment early warning

Measurable before-after sentiment comparison

Automated accountability via SLA tracking

👩‍💻 Team Dev 404 Crew

R Nisshitha – AI/ML Model Engineer

Pratheksha R D – Backend Developer

Jiya Chandrapu – Frontend Developer

🏥 Vision

To transform patient feedback from passive data into
real-time, AI-powered service improvemen
