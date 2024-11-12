import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path'

const app = express();
const salt = 10;

app.use(express.json());
app.use(cors({
     origin:["http://localhost:3000"],
     methods:["POST","GET"],
     credentials:true
}));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination:(req,file ,cb)=>{
        cb(null,'pdf')
    },
    filename: (req,file,cb)=>{
        cb(null,file.documentName + "_" + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage:storage
})

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
                next();
            }
        })
    }
}

app.get('/RegistrationProcess',verifyUser,(req, res)=>{
    return res.json({Status: "Success",name: req.name });


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
            return res.json({ Status: "Registration Success" });
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
                    return res.json({ Status: "Login Success" });
                } else {
                    return res.json({ Status: "Password not matched" });
                }
            });
        } else {
            return res.json({ Status: "No Email Existed" });
        }
    });
});

//Upload the proporsal section
app.post('/File_Upload',upload.single('pdf'),(req,res)=>{
   const pdf = req.file.filename;

})




// Server listening
app.listen(5000, () => {
    console.log("Running on port 5000...");
});
