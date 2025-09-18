# HealthVitals-AI 🩺🤖

**HealthVitals-AI** is an intelligent, AI-powered medical assistant app that helps users monitor, understand, and improve their health.  
It combines conversational AI, smart symptom scanning, and daily health check-ins to provide actionable health insights, tailored recommendations, and downloadable health reports.

---

## 📱 App Screenshots
# Home Page
<p align="center">
  <img src="https://github.com/user-attachments/assets/32961172-fed9-4ef1-a906-681f7890592f" width="250"/>
  <img src="https://github.com/user-attachments/assets/2a5bc8ad-ffdf-4c9f-ace8-4889fbaadce6" width="250"/>
</p>

# Symptoscan
<p align="center">
  <img src="https://github.com/user-attachments/assets/0ba05758-994e-44cc-9b1d-c32af3905b14" width="250"/>
  <img src="https://github.com/user-attachments/assets/c66ea0fd-4417-4d91-8248-164492706924" width="250"/>
  <img src="https://github.com/user-attachments/assets/20b5fe4e-1cc8-4394-a562-d87796b4da08" width="250"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/c133609f-5e1f-4f42-9536-dae18c4a50e7" width="250"/>
  <img src="https://github.com/user-attachments/assets/4f8b8211-0512-4e9b-a5a8-f20653053366" width="250"/>
  <img src="https://github.com/user-attachments/assets/716d0720-148a-4c96-88fd-555b6e2e4b5a" width="250"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/e6d782cb-0e28-42dd-b5ab-746d3cb142ec" width="250"/>
  <img src="https://github.com/user-attachments/assets/b6a3ea0f-2853-451a-a4b0-2a290a96b642" width="250"/>
</p>

# CalTracK 
<p align="center">
    <img src="https://github.com/user-attachments/assets/43565f4d-3b1b-49e3-b37b-58f9ac5fc3a6" width="250"/>
  <img src="https://github.com/user-attachments/assets/d24b2eab-d602-4182-9745-610a72662e8d" width="250"/>
  <img src="https://github.com/user-attachments/assets/2cc0acc6-23c4-46ac-885d-2f8c61e1604e" width="250"/>
</p>

# Laso-AI
<p align="center">
  <img src="https://github.com/user-attachments/assets/02b167ba-d938-438d-8c34-b36c3a3cea4b" width="250"/>
</p>








---

## 🚀 Features

### 🔹 User Authentication
- **Secure Login & Signup**
- Store and manage basic personal health data: height, weight, age, and more.

### 🔹 AI Health Chatbot
- Chat about any **health-related problems**.
- AI asks **follow-up questions** based on your inputs.
- Generates a **diagnostic summary** with:
  - Possible health condition
  - Recommended actions
  - Guidance for next steps

### 🔹 **SymptoScan™**
- A detailed health & mental well-being questionnaire.
- Covers multiple areas:
  - Physical health
  - Mental health
  - Lifestyle & habits
- Produces a **comprehensive, downloadable health report** with:
  - **Health Score** (1–10)
  - Key health insights
  - Personalized **meal recommendations**
  - **Medicine suggestions** (general, non-prescription)
  - Actionable steps for improvement

### 🔹 **Daily Health Check-In**
- Once every 24 hours, the app asks quick health questions.
- Tracks changes in health trends over time.

---

## 📊 How It Works

1. **Login / Signup**
   - Enter basic personal details (height, weight, etc.).

2. **Chat with AI**
   - Describe symptoms or ask health-related questions.
   - AI follows up with relevant queries to gather more context.
   - Receive a **summary or report** of the potential issue.

3. **SymptoScan™**
   - Complete a series of structured questions.
   - Get a **personalized health score** and tailored advice.

4. **Daily Questions**
   - Simple daily prompts to track your health trends.

---

## 🛠 Tech Stack

- **Frontend**: React Native (Mobile App)
- **Backend**: Node.js + Express
- **AI Engine**: Google Gemini API
- **Database**: Appwrite
- **Auth**: Clerk Authentication
- **Report Generation**: PDF downloads with health insights

---

## 📥 Installation & Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/SSIP_MOBILE_APP.git
cd Android_Application

# Install dependencies
npm install

# Backend
cd Android_Backend
npm i

# Create a .env file in the root and add:
GOOGLE_API_KEY=your_google_api_key
PORT=5000

# Start the backend server
nodemon server.js

