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

/*
========================================
MIDDLEWARE
========================================
*/

app.use(cors({
  origin: '*',
}));

app.use(express.json());

/*
========================================
DATABASE CONNECTION
========================================
*/

sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL Connected...');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database Synced');
  })
  .catch((err) => {
    console.error('CRITICAL DATABASE ERROR');
    console.error(err);
  });

/*
========================================
OPENROUTER CONFIG
========================================
*/

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
    "X-Title": "AI Resume Analyzer",
  }
});

/*
========================================
MULTER CONFIG
========================================
*/

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {

    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'), false);
    }

  }
});

/*
========================================
TEXT EXTRACTION
========================================
*/

const extractText = async (file) => {

  if (file.mimetype === 'application/pdf') {

    const data = await pdfParse(file.buffer);
    return data.text;

  }

  if (
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {

    const data = await mammoth.extractRawText({
      buffer: file.buffer
    });

    return data.value;
  }

  throw new Error('Unsupported file type');
};

/*
========================================
AUTH ROUTES
========================================
*/

app.post('/api/auth/register', async (req, res) => {

  const { name, email, password } = req.body;

  try {

    const userExists = await User.findOne({
      where: { email }
    });

    if (userExists) {
      return res.status(400).json({
        error: 'User already exists'
      });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

app.post('/api/auth/login', async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await User.findOne({
      where: { email }
    });

    if (user && (await user.matchPassword(password))) {

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token
      });

    } else {

      res.status(401).json({
        error: 'Invalid email or password'
      });

    }

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

/*
========================================
HISTORY ROUTE
========================================
*/

app.get('/api/resumes', protect, async (req, res) => {

  try {

    const resumes = await Resume.findAll({
      where: {
        userId: req.user.id
      },
      order: [['createdAt', 'DESC']]
    });

    res.json(resumes);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

/*
========================================
RESUME ANALYSIS
========================================
*/

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

      return res.status(400).json({
        error: 'No file uploaded'
      });

    }

    /*
    EXTRACT TEXT
    */

    let text;

    try {

      text = await extractText(req.file);

    } catch (err) {

      console.error('Extraction Error:', err);

      return res.status(500).json({
        error: `Text Extraction Failed: ${err.message}`
      });

    }

    if (!text || text.trim().length === 0) {

      return res.status(400).json({
        error: 'Could not extract text'
      });

    }

    /*
    AI ANALYSIS
    */

    let analysis;

    try {

      const response = await openai.chat.completions.create({

        model: "openai/gpt-4o-mini",

        messages: [

          {
            role: "system",
            content: `
You are an expert HR and recruitment assistant.

Analyze the provided resume text and return JSON containing:

- skills
- score
- improvements
- summary
${targetDescription ? "- atsMatch" : ""}
${targetDescription ? "- skillGaps" : ""}

Return ONLY valid JSON.
`
          },

          {
            role: "user",
            content: `
Resume Content:
${text}

${targetDescription ? `Job Description:\n${targetDescription}` : ""}
`
          }

        ],

        response_format: {
          type: "json_object"
        }

      });

      analysis = JSON.parse(
        response.choices[0].message.content
      );

    } catch (err) {

      console.error('OPENAI ERROR:', err);

      return res.status(500).json({
        error: `AI Analysis Failed: ${err.message}`
      });

    }

    /*
    SAVE TO DATABASE
    */

    try {

      const newResume = await Resume.create({

        userId,

        fileName: req.file.originalname,

        targetRole,

        targetDescription,

        extractedText: text,

        analysis

      });

      res.json({
        success: true,
        data: newResume
      });

    } catch (err) {

      console.error('DATABASE SAVE ERROR:', err);

      res.json({
        success: true,
        data: { analysis },
        warning: 'Could not save to history'
      });

    }

  } catch (error) {

    console.error('GENERAL ERROR:', error);

    res.status(500).json({
      error: error.message || 'Resume processing failed'
    });

  }

});

/*
========================================
INTERVIEW ROUTE
========================================
*/

app.post('/api/interview', protect, async (req, res) => {

  const { resumeText, targetDescription } = req.body;

  if (!resumeText) {

    return res.status(400).json({
      error: 'Resume text is required'
    });

  }

  try {

    const response = await openai.chat.completions.create({

      model: "openai/gpt-4o-mini",

      messages: [

        {
          role: "system",
          content: `
Generate:
- 5 Technical Questions
- 5 Behavioral Questions

Return ONLY JSON.
`
        },

        {
          role: "user",
          content: `
Resume:
${resumeText}

Job Description:
${targetDescription || 'General Position'}
`
        }

      ],

      response_format: {
        type: "json_object"
      }

    });

    const questions = JSON.parse(
      response.choices[0].message.content
    );

    res.json(questions);

  } catch (error) {

    console.error('Interview AI Error:', error);

    res.status(500).json({
      error: 'Failed to generate interview questions'
    });

  }

});

/*
========================================
BASE ROUTE
========================================
*/

app.get('/', (req, res) => {
  res.send('AI Resume Analyzer API Running...');
});

/*
========================================
VERCEL EXPORT
========================================
*/

if (process.env.NODE_ENV !== 'production') {

  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

}

module.exports = app;