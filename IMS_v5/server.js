const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.static('public')); // to serve images from public/images

// Setup storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Save to this folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep original name
  }
});

const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({
    message: 'Image uploaded successfully!',
    filename: req.file.filename,
    filePath: `/images/${req.file.filename}`
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
