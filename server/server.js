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




// Enhanced Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'pdf', 'proposals');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `proposal-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});



// Enhanced File Filter
const fileFilter = (req, file, cb) => {
    // Accept only PDF files
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

// Multer Upload Configuration
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB file size limit
    }
});




// Proposal Upload Route
app.post('/File_Upload', verifyUser, upload.single('pdf'), (req, res) => {
    // Check if file was uploaded
    if (!req.file) {
        return res.status(400).json({ 
            Status: "Error", 
            Message: "No file uploaded" 
        });
    }

    // Get email from verified user
    const email = req.email;
    const proposalFileName = req.file.filename;
    const proposalFilePath = req.file.path;
    const uploadDate = new Date();

    // SQL query to insert proposal details
    const sql = `
        INSERT INTO proposal 
        (email, proposal_status, proposal_file_path, proposal_upload_date) 
        VALUES (?, ?, ?, ?)
    `;

    const values = [
        email, 
        'PENDING', // Initial status
        proposalFilePath, 
        uploadDate
    ];

    // Execute database insertion
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error inserting proposal:", err);
            
            // Optional: Delete uploaded file if database insertion fails
            const fs = require('fs');
            if (fs.existsSync(proposalFilePath)) {
                fs.unlinkSync(proposalFilePath);
            }

            return res.status(500).json({ 
                Status: "Error", 
                Message: "Failed to save proposal details",
                Error: err.message 
            });
        }

        // Send success response
        res.status(200).json({ 
            Status: "Success", 
            Message: "Proposal uploaded successfully",
            FileName: proposalFileName,
            OriginalFileName: req.file.originalname,
            FilePath: proposalFilePath
        });
    });
});

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
  


// Server listening
app.listen(5000, () => {
    console.log("Running on port 5000...");
});
