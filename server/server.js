import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import nodemailer from 'nodemailer';
import session from 'express-session';
import { google } from 'googleapis';
import fs from 'fs';  // Add this import
import { promisify } from 'util';
import { fileURLToPath } from 'url';







const app = express();
const salt = 10;



app.use(express.json());
app.use(cors({
     origin:["http://localhost:3000"],
     methods:["POST","GET"],
     credentials:true
}));
app.use(cookieParser());


// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'phd_db'
});

const verifyUser = (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.json({Error:"You are not autyhenticated"});
    }else{
        jwt.verify(token,"jwt-secret-key",(err,decoded)=>{
            if(err){
                return res.json({Error:"token is not correct"});
            }else{
                req.name = decoded.name;
                req.email= decoded.email;
                next();
            }
        })
    }
}

//Registration process authenticate function
app.get('/RegistrationProcess',verifyUser,(req, res)=>{
    return res.json({Status: "Success",  name:req.name , email:req.email});


})

app.get('/SupervisorHome',verifyUser,(req, res)=>{
    return res.json({Status: "Success",name: req.name });


})

//prporsal upload authentication function
app.get('/File_Upload',verifyUser,(req, res)=>{
    return res.json({Status: "Success",  name:req.name , email:req.email});

})




db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Route for registration (StudentRegister)
app.post('/SuperRegister', (req, res) => {
    const sql = "INSERT INTO superregister (name, email, idNo, telNo, password) VALUES (?)";

    bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) return res.json({ Error: "Error hashing password" });

        const values = [
            req.body.name,
            req.body.email,
            req.body.idNo,
            req.body.telNo,
            hash
        ];

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error inserting data into database:", err);
                return res.json({ Error: "Error inserting data into database" });
            }
            return res.json({ Status: "Registration Success" });
        });
    });
});


app.post('/RegisterStudentComp', (req, res) => {
    const sql = "INSERT INTO studentregister (name, email, telNo, supName, field, password) VALUES (?)";

    bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) return res.json({ Error: "Error hashing password" });

        const values = [
            req.body.name,
            req.body.email,
            req.body.telNo,
            req.body.supName,
            req.body.field,
            hash
        ];

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error inserting data into database:", err);
                return res.json({ Error: "Error inserting data into database" });
            }
           // Email sending logic
           const transporter = nodemailer.createTransport({
            service: 'gmail', // Or your preferred email service
            host:"smtp.gmail.com",
            port: 587,
            srcure: false,
            auth: {
                user: 'wijesinghetsw@gmail.com', // Replace with your email
                pass: 'nkwpdzcyzqndtvrm' // Replace with your email password or app password
            }
        });



        const mailOptions = {
            from: 'wijesinghetsw@gmail.com', // Sender's email address
            to: 'kmswi241@kln.ac.lk', // Replace with the recipient's email
            subject: 'New Student Registration',
            text: `A new student has registered:\n
            Name: ${req.body.name}
            Email: ${req.body.email}
            Telephone: ${req.body.telNo}
            Supervisor: ${req.body.supName}
            Field: ${req.body.field}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.json({ Error: "Error sending email notification" });
            }
            console.log("Email sent: " + info.response);
            return res.json({ Status: "Registration Success and Email Sent" });
        });
    });
});
});

// New route for login (SuperLogin)
app.post('/Login', (req, res) => {
    const sql =  "SELECT * FROM superregister WHERE email = ?"


    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json({ Error: "Login Error in Server" });
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.json({ Error: "Password compare error" });
                if (response) {
                    const name = data[0].name;
                    const token = jwt.sign({name},"jwt-secret-key",{expiresIn:'1d'});
                    res.cookie('token',token)
                    return res.json({ Status: "Success" });
                } else {
                    return res.json({ Status: "Password not matched" });
                }
            });
        } else {
            return res.json({ Status: "No Email Existed" });
        }
    });
});

// New route for login (StudentLogin)
app.post('/LoginStudent', (req, res) => {
    const sql =  "SELECT * FROM studentregister WHERE email = ?"


    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json({ Error: "Login Error in Server" });
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.json({ Error: "Password compare error" });
                if (response) {
                    const email=data[0].email;
                    const name = data[0].name;
                    const token = jwt.sign({name,email},"jwt-secret-key",{expiresIn:'1d'});
                    res.cookie('token',token)
                    return res.json({ Status: "Success" });
                } else {
                    return res.json({ Status: "Password not matched" });
                }
            });
        } else {
            return res.json({ Status: "No Email Existed" });
        }
    });
}); 


app.use(cookieParser());
app.use(session({
    secret: 'Changumitsw_213',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


// Middleware
app.use(cookieParser());
app.use(session({
    secret: 'Changumitsw_213',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true }
}));

// Logout route
app.get('/logout', (req, res) => {
    try {
        // Check if session exists
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    return res.status(500).json({ message: 'Could not log out' });
                }

                // Clear session cookie
                res.clearCookie('connect.sid', {
                    path: '/',
                    secure: false,
                    httpOnly: true
                });

                // Send successful logout response
                res.status(200).json({ message: 'Logged out successfully' });
            });
        } else {
            res.status(200).json({ message: 'No active session' });
        }
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Logout failed' });
    }
});


//file google drive uploads start///////////////////////////////////////////////////////////////





// File size and type validation
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['application/pdf'];
const TEMP_DIR = path.join(process.cwd(), 'temp');
const DRIVE_FOLDER_ID = '14T_4y6ZZCUpt7_ZnIfIIwRQ0reUJ0ox-'; // Replace with your Google Drive folder ID

// Create temp directory using process.cwd() instead of __dirname
const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Configure multer with validation
const storage = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    // Create a safe filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Check file type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new Error('Only PDF files are allowed'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: fileFilter
});

// Google Drive API configuration
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: SCOPES,
});
const drive = google.drive({ version: 'v3', auth });

// Helper function to clean up temporary files
const cleanupTempFile = async (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (error) {
    console.error('Error cleaning up temp file:', error);
  }
};

// Authentication check endpoint
app.get('/File_Upload', async (req, res) => {
  try {
    // Get user session or token validation logic here
    const isAuthenticated = true; // Replace with your actual auth check
    const userData = {
        name: req.session.name, // Assuming you store name in session
        email: req.email
    };

    if (isAuthenticated) {
      res.json({
        Status: "Success",
        name: userData.name,
        email: userData.email
      });
    } else {
      res.status(401).json({
        Status: "Error",
        Error: "Not authenticated"
      });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({
      Status: "Error",
      Error: "Authentication failed"
    });
  }
});

// Upload endpoint
app.post('/File_Upload', upload.single('pdf'), async (req, res) => {
  let filePath = null;
  
  try {
    // Validate request
    if (!req.file) {
      return res.status(400).json({
        Status: "Error",
        Message: "No file uploaded"
      });
    }

    if (!req.body.email) {
      return res.status(400).json({
        Status: "Error",
        Message: "Email is required"
      });
    }

    filePath = req.file.path;
    const userEmail = req.body.email;

    // Prepare file metadata for Google Drive
    const fileMetadata = {
      name: req.file.originalname,
      parents: ['14T_4y6ZZCUpt7_ZnIfIIwRQ0reUJ0ox-'] // Your folder ID
    };

    const media = {
      mimeType: 'application/pdf',
      body: fs.createReadStream(filePath)
    };

    // Upload to Google Drive
    const driveResponse = drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, webViewLink'
    });

    // Set file permissions
    await drive.permissions.create({
      fileId: driveResponse.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    // Save to database
    const insertQuery = `
      INSERT INTO proposal_upload (
        file_name,
        drive_file_id,
        drive_view_link,
        user_email,
        upload_date,
        status
      ) VALUES (?, ?, ?, ?, NOW(), 'PENDING')
    `;

    await query(insertQuery, [
      req.file.originalname,
      driveResponse.data.id,
      driveResponse.data.webViewLink,
      userEmail
    ]);

    // Success response
    res.json({
      Status: "Success",
      Message: "File uploaded successfully",
      DriveLink: driveResponse.data.webViewLink
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    let errorMessage = "Failed to upload file";
    let statusCode = 500;

    if (error.code === 'LIMIT_FILE_SIZE') {
      errorMessage = "File size exceeds 10MB limit";
      statusCode = 400;
    } else if (error.message === 'Only PDF files are allowed') {
      errorMessage = error.message;
      statusCode = 400;
    }

    res.status(statusCode).json({
      Status: "Error",
      Message: errorMessage
    });

  } finally {
    // Clean up temporary file
    await cleanupTempFile(filePath);
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        Status: "Error",
        Message: "File size exceeds 10MB limit"
      });
    }
  }
  
  console.error('Server error:', error);
  res.status(500).json({
    Status: "Error",
    Message: "Internal server error"
  });
});







//Drive upload End










// Authentication Check Route
app.get('/File_Upload', verifyUser, (req, res) => {
    // Return user details for authentication
    res.json({
        Status: "Success",
        name: req.session.name, // Assuming you store name in session
        email: req.email
    });
});


app.get('/reviewers', (req, res) => {
    try {
      const sql = 'SELECT rew_id AS id, rew_name AS name FROM reviewers ORDER BY rew_name ASC';
      
      db.query(sql, (err, results) => {
        if (err) {
          console.error('Error fetching reviewers:', err);
          return res.status(500).json({
            error: 'An error occurred while fetching reviewers',
            details: err.message
          });
        }
  
        // Send the reviewers as a JSON response
        res.json(results);
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ 
        error: 'An unexpected error occurred',
        details: error.message 
      });
    }
  });

  app.get('/students', (req, res) => {
    try {
      const sql = 'SELECT * FROM studentregister LEFT JOIN proposal ON studentregister.email = proposal.email';
      
      db.query(sql, (err, results) => {
        if (err) {
          console.error('Error fetching students:', err);
          return res.status(500).json({
            error: 'An error occurred while fetching reviewers',
            details: err.message
          });
        }
  
        // Send the reviewers as a JSON response
        res.json(results);
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ 
        error: 'An unexpected error occurred',
        details: error.message 
      });
    }
  });



  // Route for registration (StudentRegister)
app.post('/AdminHome', (req, res) => {
    const sql = "INSERT INTO reviewers (rew_name, rew_email, field) VALUES (?)";

    

        const values = [
            req.body.rew_name,
            req.body.rew_email,
            req.body.rew_field,
            

        ];

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error inserting data into database:", err);
                return res.json({ Error: "Error inserting data into database" });
            }
            return res.json({ Status: "Registration Success" });
        });
    
});



// Route to get student details by name 
  app.get('/students/name/:studentName', (req, res) => {
    const studentName = req.params.studentName;
    const query = 'SELECT p.*, s.* FROM studentregister s LEFT JOIN proposal p ON s.email = p.email WHERE s.student_id = ?';
    
    db.query(query, [studentName], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ error: 'Database query error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(results[0]);
    });
});





// Server listening
app.listen(5000, () => {
    console.log("Running on port 5000...");
});
