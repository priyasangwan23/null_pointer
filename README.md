# ☕ Digital Clone

> **An AI-powered Digital Clone that learns your communication style from exported chat history and responds just like you.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)
![Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?logo=google)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Overview

Digital Clone is an AI-powered conversational assistant that **mimics a person's communication style** by analyzing exported chat history.

Instead of simply answering questions, the system understands how a person communicates—their tone, reply length, emoji usage, language preference, and conversational habits—and generates responses that closely resemble that person's messaging style.

---

## ✨ Features

- 📂 Upload exported WhatsApp chat (.txt)
- 🤖 AI-powered personality analysis using Google Gemini
- 💬 Mimics real communication style
- 😊 Detects emoji usage and tone
- 🌍 Supports multilingual conversations
- 🧠 Identifies communication patterns
- 📊 Generates a personality profile
- 💾 Stores analyzed data in MongoDB
- ⚡ Real-time AI chat
- 🎨 Modern Coffee-themed UI
- 📱 Responsive Design

---

## 🚀 How It Works

```text
Export WhatsApp Chat (.txt)
            │
            ▼
Upload Chat
            │
            ▼
Parse Messages
            │
            ▼
Extract Conversation Patterns
            │
            ▼
Analyze Personality (Gemini)
            │
            ▼
Generate Personality Profile
            │
            ▼
Store in MongoDB
            │
            ▼
AI Responds Like You
```

---

## 🧠 AI Pipeline

### Step 1
User exports a WhatsApp conversation.

↓

### Step 2
The exported `.txt` file is uploaded.

↓

### Step 3
Backend parses the conversation.

↓

### Step 4
Incoming messages and user replies are extracted.

↓

### Step 5
Google Gemini analyzes:

- Communication tone
- Reply style
- Emoji usage
- Formality
- Language
- Common phrases
- Conversation habits

↓

### Step 6
The personality profile is stored in MongoDB.

↓

### Step 7
Whenever a new message is received, the AI combines:

- Personality Profile
- Previous Reply Examples
- Current User Message

to generate a response that closely matches the user's natural communication style.

---

## 📂 Project Structure

```
Digital Clone

├── frontend
│   ├── React
│   ├── Vite
│   ├── Tailwind CSS
│   └── Components
│
├── backend
│   ├── Express
│   ├── Gemini API
│   ├── MongoDB
│   ├── File Parser
│   ├── Personality Analyzer
│   └── REST APIs
│
└── Database
    ├── Personality
    ├── Chat History
    └── Training Data
```

---

## 🛠 Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend

- Node.js
- Express.js
- Google Gemini API
- Multer
- JWT Authentication

### Database

- MongoDB
- Mongoose

---

## 📊 Personality Analysis

Digital Clone automatically analyzes:

- Communication Tone
- Emoji Usage
- Language Preference
- Reply Length
- Humor Level
- Formality
- Greeting Style
- Common Words
- Frequently Used Phrases
- Conversation Behaviour

---

## 📸 Screenshots

> Add project screenshots here.

```
/screenshots

dashboard.png

chat.png

upload.png

personality.png
```

---

## ⚙ Installation

### Clone Repository

```bash
git clone https://github.com/username/digital-clone.git

cd digital-clone
```

---

### Backend

```bash
cd backend

npm install

npm run dev
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## 🔑 Environment Variables

Create `.env`

```env
PORT=5000

MONGODB_URI=your_mongodb_connection

GEMINI_API_KEY=your_api_key

JWT_SECRET=your_secret
```

---

## 🎯 Future Improvements

- Telegram Integration
- WhatsApp Cloud API
- Email Conversation Analysis
- Voice Cloning
- Face Avatar
- RAG-based Memory
- Multi-user Profiles
- Smart Context Retrieval
- Deployment Support
- Multi-language Translation

---

## 🌟 Why Digital Clone?

Unlike a traditional chatbot, Digital Clone focuses on **how a person communicates**, not just **what they communicate**.

It learns:

- Writing style
- Conversation habits
- Emotional tone
- Response behavior

making conversations feel significantly more personal and realistic.

---

## 👩‍💻 Author

**Nandini Prajapati**

Backend Developer | Full Stack Developer

GitHub: https://github.com/yourusername

LinkedIn: https://linkedin.com/in/yourprofile

---

## ⭐ Support

If you like this project,

⭐ Star this repository

🍴 Fork it

🤝 Contribute

and feel free to open Issues or Pull Requests.

---

Made with ❤️ using React, Node.js, MongoDB & Google Gemini
