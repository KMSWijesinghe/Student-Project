import React, { useEffect, useState } from "react";
import "./supervisorHome.css"; // Import the CSS file
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom';

import axios from 'axios'



export default function SupervisorHome() {
  const [students, setStudents] = useState([]);
  const [newsUpdates, setNewsUpdates] = useState([]);


  const navigate = useNavigate();

  const[auth,setAuth]=useState(false);
  const[message,setMessage] = useState('')
  const[name,setName]=useState('')
  
  axios.defaults.withCredentials = true;
  
  useEffect(()=>{
    axios.get('http://localhost:5000/SupervisorHome')
              .then(res => {
                  if (res.data.Status === "Success") {
                      setAuth(true)
                      setName(res.data.name)
                     
                  } else {
                      setAuth(false)
                      setMessage(res.data.Error)
                     
                  }
              
  })
  
  
  })

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch("/api/students"); // Replace with actual API endpoint
      const data = await response.json();
      setStudents(data);
    };

    const fetchNewsUpdates = async () => {
      const response = await fetch("/api/news"); // Replace with actual API endpoint
      const data = await response.json();
      setNewsUpdates(data);
    };

    fetchStudents();
    fetchNewsUpdates();
  }, []);

  return (
    <div className="superHome">
       <Header/>
       { 
             auth ?
           <div>
          <h2>You are Autherized--{name}</h2>
           <button className='log' >Logout</button>
           </div>
           :
           <div>{
            navigate('/Login')
           }
           </div>
          

             }
    <div className="containersuperviserHome">
      {/* Student Register Box */}
      <div className="align1">
      <div className="box">
        <h3 className="topics">Registered Students</h3>
        <div className="scroll-box">
          {students.length > 0 ? (
            students.map((student) => (
              <div key={student.id} className="student-item">
                <span>{student.name}</span>
                <button
                  className="view-button"
                  onClick={() => window.open(student.homePage, "_blank")}
                >
                  View
                </button>
              </div>
            ))
          ) : (
            <p>No students registered yet.</p>
          )}
        </div>
      </div>
      </div>
      
      <div className="align2">
      {/* News Updates Box */}
      <div className="box">
        <h3  className="topics">News Updates</h3>
        <div className="scroll-box">
          {newsUpdates.length > 0 ? (
            newsUpdates.map((update, index) => (
              <p key={index} className="news-item">
                {update}
              </p>
            ))
          ) : (
            <p>No updates available.</p>
          )}
        </div>
      </div>
      </div>
      </div>
      <Footer/>
      </div>
    
  );
}
