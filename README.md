# 🚀 AI Resume Analyzer

An intelligent, full-stack application designed to help job seekers optimize their resumes using AI. Upload your resume, get an instant score, identify skill gaps, and prepare for interviews with AI-generated questions.

![AI Resume Analyzer](https://img.shields.io/badge/AI-Powered-blueviolet?style=for-the-badge&logo=openai)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

---

## ✨ Features

- **📄 Smart Parsing**: Supports both **PDF** and **DOCX** formats using `pdf-parse` and `mammoth`.
- **📊 Resume Scoring**: Get a quality score (0-100) based on industry standards and AI analysis.
- **🔍 Skill Gap Analysis**: Compare your resume against specific job descriptions to find matching and missing skills.
- **📈 Visual Insights**: interactive radar charts powered by `Recharts` to visualize your skill coverage.
- **💡 Actionable Feedback**: Receive specific, AI-generated tips to improve your resume's impact.
- **🤖 Interview Prep**: Generate customized Technical and Behavioral interview questions based on your background and target role.
- **🔐 Secure Auth**: Built-in user authentication (JWT) to save and revisit your analysis history.

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
- **Database**: PostgreSQL with **Sequelize ORM**
- **AI Integration**: OpenAI (GPT-4o-mini) via **OpenRouter**
- **File Handling**: Multer

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running
- OpenRouter API Key (or OpenAI API Key)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Divyasri-m18/Ai-Resume-Analyzer.git
   cd Ai-Resume-Analyzer
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   DATABASE_URL=postgres://username:password@localhost:5432/resume_analyzer
   OPENAI_API_KEY=your_openrouter_api_key
   JWT_SECRET=your_jwt_secret
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

### Running the App

1. **Start Backend** (from `/server`)
   ```bash
   npm run dev
   ```

2. **Start Frontend** (from `/client`)
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

---

## 🛡️ License
Distributed under the ISC License.

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

---

**Built with ❤️ for better careers.**
