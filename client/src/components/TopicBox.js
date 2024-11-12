import React from 'react'
import './topicbox.css'
import { Link } from 'react-router-dom';
import {useNavigate} from 'react-router-dom';

/*const RegisterStudent = () => {
  const navigate = useNavigate();}

  const SuperRegister = () => {
    navigate('/another');}*/

export default function TopicBox() {
  const topic = "PHD/MPhil Students Portal"
  return (
    
   
    <div className="container">
  

    {/* Register Section */}
    <div className="register-section">
      <h3 className='h3'>Register</h3>
      <Link to="/RegisterStudent">
      <button className="register-button">FOR STUDENTS</button>
      </Link>
      <Link to="/SuperRegister">
      <button className="register-button">FOR SUPERVISORS</button>
      </Link>
      <Link to="/Login">
      <button className="register-button">Login</button>
      </Link>
    </div>

    {/* About Us Section */}
    <div className="about-section">
      <h3>About Us</h3>
      <p>
        "The Faculty aspires to be an internationally recognised institution of higher 
        education in a culture of excellence and integrity that helps to generate and 
        impart knowledge in the medical sciences"
      </p>
    </div>
  </div>
  )
}
