require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Project = require('./models/Project');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 MongoDB connected successfully.'))
  .catch((err) => {
    console.error('🔴 DB Connection error:', err.message);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.send('Portfolio API Service is running...');
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ success: false, error: 'Server error loading projects' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { title, description, tags, github, liveUrl, featured } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description required' });
    }

    const newProject = await Project.create({
      title,
      description,
      tags: tags || [],
      github,
      liveUrl,
      featured
    });

    res.status(201).json({ success: true, data: newProject });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create project entry' });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
  }

  console.log(`📩 New Contact Msg from [${name} - ${email}]: "${message}"`);
  res.status(200).json({ success: true, message: 'Message received! I will reply soon.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});