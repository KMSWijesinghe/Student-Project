// file_upload.js

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router(); // Create a router instance

// Multer configuration for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files will be stored in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// Configure Multer with file size limit and file type filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('application/pdf')) {
      return cb(new Error('Only PDF files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Create 'uploads' directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Define the file upload route
router.post('/upload', upload.single('documentFile'), (req, res) => {
  const { documentName, supervisor } = req.body;
  const documentFile = req.file;

  // Validate form fields
  if (!documentName || !supervisor || !documentFile) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Respond to the client with success message and file info
  res.status(200).json({
    message: 'Document uploaded successfully!',
    file: documentFile.filename,
  });
});

// Export the router to be used in the main server file
module.exports = router;
