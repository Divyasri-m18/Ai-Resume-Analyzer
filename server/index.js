require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const OpenAI = require('openai');
const jwt = require('jsonwebtoken');
const Resume = require('./models/Resume');
const User = require('./models/User');
const { protect } = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection & Sync
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL Connected...');
    return sequelize.sync(); // Create tables if they don't exist
  })
  .then(() => console.log('Database Synced'))
  .catch((err) => {
    console.error('CRITICAL: Database connection error!');
    console.error(err);
  });

// OpenAI Configuration (Using OpenRouter)
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "AI Resume Analyzer",
  }
});

// Multer Storage Configuration (In-memory)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'), false);
    }
  }
});

// Helper Function to Extract Text from PDF or DOCX
const extractText = async (file) => {
  if (file.mimetype === 'application/pdf') {
    const data = await pdfParse(file.buffer);
    return data.text;
  } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const data = await mammoth.extractRawText({ buffer: file.buffer });
    return data.value;
  }
  throw new Error('Unsupported file type');
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ error: 'User already exists' });
    
    const user = await User.create({ name, email, password });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
    
    res.status(201).json({ id: user.id, name: user.name, email: user.email, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
      res.json({ id: user.id, name: user.name, email: user.email, token });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// History Route
app.get('/api/resumes', protect, async (req, res) => {
  try {
    const resumes = await Resume.findAll({ 
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Endpoint for Resume Analysis
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  const authHeader = req.headers.authorization;
  let userId = null;
  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.decode(token);
      userId = decoded?.id || null;
    } catch (err) {
      console.error('Token decode error:', err);
    }
  }

  const { targetRole, targetDescription } = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // 1. Extract Text
    let text;
    try {
      text = await extractText(req.file);
    } catch (err) {
      console.error('Extraction Error:', err);
      return res.status(500).json({ error: `Text Extraction Failed: ${err.message}` });
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from file' });
    }

    // 2. Call OpenAI API
    let analysis;
    try {
      const response = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert HR and recruitment assistant. Analyze the provided resume text and return a JSON object containing:
            - 'skills' (array of strings)
            - 'score' (number out of 100 representing general quality)
            - 'improvements' (array of actionable tips)
            - 'summary' (brief profile overview)
            ${targetDescription ? "- 'atsMatch' (number out of 100 representing match for the specific job description provided)" : ""}
            ${targetDescription ? "- 'skillGaps' (object with { matching: string[], missing: string[], categories: { name: string, match: number }[] })" : ""}
            
            Return ONLY the JSON object.`
          },
          {
            role: "user",
            content: `Resume Content:\n${text}\n\n${targetDescription ? `Target Job Description:\n${targetDescription}` : ""}`
          }
        ],
        response_format: { type: "json_object" }
      });
      analysis = JSON.parse(response.choices[0].message.content);
    } catch (err) {
      console.error('OpenAI Error:', err);
      return res.status(500).json({ error: `AI Analysis Failed: ${err.message}` });
    }

    // 3. Save to SQL
    try {
      const newResume = await Resume.create({
        userId,
        fileName: req.file.originalname,
        targetRole,
        targetDescription,
        extractedText: text,
        analysis: analysis,
      });
      res.json({ success: true, data: newResume });
    } catch (err) {
      console.error('Database Error (Continuing anyway):', err);
      res.json({ 
        success: true, 
        data: { analysis }, 
        warning: 'Analysis complete, but could not save to history.' 
      });
    }

  } catch (error) {
    console.error('General Error:', error);
    res.status(500).json({ error: error.message || 'Error processing resume' });
  }
});

// AI Interview Preparer Route
app.post('/api/interview', protect, async (req, res) => {
  const { resumeText, targetDescription } = req.body;
  
  if (!resumeText) {
    return res.status(400).json({ error: 'Resume text is required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a recruitment expert. Based on the resume and job description provided, generate a set of practical interview questions.
          Return a JSON object with:
          - 'questions' (array of objects with { id: number, type: 'Technical'|'Behavioral', question: string, sampleAnswer: string })
          
          Provide 5 technical and 5 behavioral questions. Return ONLY the JSON object.`
        },
        {
          role: "user",
          content: `Resume:\n${resumeText}\n\nJob Description:\n${targetDescription || 'General position'}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const questions = JSON.parse(response.choices[0].message.content);
    res.json(questions);
  } catch (error) {
    console.error('OpenAI Interview Error:', error);
    res.status(500).json({ error: 'Failed to generate interview questions' });
  }
});

// Base Route
app.get('/', (req, res) => {
  res.send('AI Resume Analyzer API (PostgreSQL) is running...');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

