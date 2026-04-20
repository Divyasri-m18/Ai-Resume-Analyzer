# 🚀 AI Resume Analyzer

An intelligent, full-stack application designed to help job seekers optimize their resumes using AI. Upload your resume, get an instant score, identify skill gaps, and prepare for interviews with AI-generated questions.

![AI-Powered](https://img.shields.io/badge/AI-Powered-blueviolet?style=for-the-badge&logo=openai)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)

---

## 📖 Overview

AI Resume Analyzer helps job seekers bridge the gap between their current resume and their dream job. Upload a PDF or DOCX resume, paste a job description, and get instant AI-powered feedback — including a quality score, skill gap breakdown, and tailored interview questions — all in one place.

---

## ✨ Features

- **📄 Smart Parsing** — Supports both **PDF** and **DOCX** formats using `pdf-parse` and `mammoth`.
- **📊 Resume Scoring** — Get a quality score (0–100) based on industry standards and AI analysis.
- **🔍 Skill Gap Analysis** — Compare your resume against a job description to identify matching and missing skills.
- **📈 Visual Insights** — Interactive radar charts powered by `Recharts` to visualize your skill coverage.
- **💡 Actionable Feedback** — Receive specific, AI-generated tips to improve your resume's impact.
- **🤖 Interview Prep** — Generate customized Technical and Behavioral interview questions based on your background and target role.
- **🔐 Secure Auth** — Built-in user authentication (JWT) to save and revisit your analysis history.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Vanilla CSS with modern aesthetics
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **State/Routing**: React Router 7

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **AI Integration**: OpenRouter (GPT-4o-mini)
- **File Handling**: Multer

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL installed and running
- [OpenRouter API Key](https://openrouter.ai/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Divyasri-m18/Ai-Resume-Analyzer.git
   cd Ai-Resume-Analyzer
   ```

2. **Setup the backend**
   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   DATABASE_URL=postgres://username:password@localhost:5432/resume_analyzer
   OPENAI_API_KEY=your_openrouter_api_key
   JWT_SECRET=your_jwt_secret
   ```

   | Variable | Description |
   |---|---|
   | `PORT` | Port for the Express server (default: 5000) |
   | `DATABASE_URL` | PostgreSQL connection string |
   | `OPENAI_API_KEY` | Your OpenRouter API key |
   | `JWT_SECRET` | Secret key used to sign JWT tokens |

3. **Setup the frontend**
   ```bash
   cd ../client
   npm install
   ```

### Running the App

1. **Start the backend** (from `server/`)
   ```bash
   npm run dev
   ```

2. **Start the frontend** (from `client/`)
   ```bash
   npm run dev
   ```

The app will be available at **http://localhost:5173**.

---

## 🔄 How It Works

1. **Upload** your resume (PDF or DOCX) and optionally paste a target job description.
2. **Analyze** — the AI parses your resume, scores it, and maps your skills against the role.
3. **Review** your score, skill gap radar chart, improvement tips, and generated interview questions.

---

## 📂 Project Structure

```
Ai-Resume-Analyzer/
├── client/          # React frontend (Vite)
│   └── src/
├── server/          # Express backend
│   ├── routes/
│   ├── models/
│   └── controllers/
└── README.md
```
**Built with ❤️ for better careers.**
