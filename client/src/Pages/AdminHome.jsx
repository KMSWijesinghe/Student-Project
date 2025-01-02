import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate,Outlet } from 'react-router-dom';
import './adminHome.css'
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AdminHome() {
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchStudents = async () => {
        try {
          const response = await axios.get('http://localhost:5000/students');
          setStudents(response.data);
        } catch (error) {
          console.error('Error fetching reviewers:', error);
        }
      };
  
      fetchStudents();
    }, []);

    
  
    const handleStudentChange = (event) => {
      // Find the full student object based on selected ID
      const selectedStudent = students.find(student => student.student_id.toString() === event.target.value);
      setSelectedStudents(selectedStudent);
    };
    
     // Handle student selection change
  

    // Handle navigation to student profile
  const handleGoToProfile = async () => {
    if (!selectedStudents) {
      alert('Please select a student');
      return;
    }

    try {
      // Fetch full student details
      const response = await axios.get(`http://localhost:5000/students/name/${encodeURIComponent(selectedStudents.student_id)}`);
      const studentDetails = response.data;

      // Navigate to student profile page with student details
      navigate('/AdminHome/Admin', { 
        state: { studentDetails: selectedStudents }
      });
    } catch (error) {
      console.error('Error fetching student details:', error);
      alert('Could not fetch student details');
    }
  };


    const [url, setUrl] = useState('http://localhost:3000/AdminHome');
    const [registerValues, setRegisterValues] = useState({
        rew_name: '',
        rew_email: '',
        field: '',
       
    });

 

 

    // Handle registration form submit
    const handleReviwers = (event) => {
        event.preventDefault();
        console.log("Registration form submitted");

        axios.post('http://localhost:5000/AdminHome', registerValues)
            .then(res => {
                if (res.data.Status === "Registration Success") {
					alert("You have Registered Successfully");
                    navigate('/Login');
                } else {
                    alert(res.data.Error || "Registration failed");
                }
                console.log(res);
            })
            .catch(err => {
                console.error(err);
                alert("An error occurred during registration");
            });
    };
  return (
    <div className='AdminAll'>
        <Header/>
    <div className='AdminHome'>
            <div className='StudentLIst'>
                <h3>Student List</h3>

                <select 
                        value={selectedStudents ? selectedStudents.student_id : ''}
                        onChange={handleStudentChange}
                        className="select_block"
                    >
                        <option value="">Select a student</option>
                        {students.map((students) => (
                            <option 
                                key={students.student_id} 
                                value={students.student_id.toString()}
                            >
                                {students.name}
                            </option>
                        ))}
                    </select>

      <button className='go_to_profile' type='button'
        onClick={handleGoToProfile}
        disabled={!selectedStudents}>Go to Profile</button>



            </div>
            
            <div className='addReviewers'>
            <h3>Add Reviewers</h3>
            <div className="signup">
                    <form onSubmit={handleReviwers}>
                        
                        <input type="varchar" name="rew_name" placeholder="Reviewer Name" required=""
                            onChange={e => setRegisterValues({ ...registerValues, rew_name: e.target.value })} />
                        <input type="email" name="rew_email" placeholder="Email" required=""
                            onChange={e => setRegisterValues({ ...registerValues, rew_email: e.target.value })} />
                        <input type="varchar" name="field" placeholder="field" required=""
                            onChange={e => setRegisterValues({ ...registerValues, field: e.target.value })} />
                       
                        <button type='submit'>Register</button>
                    </form>
                </div>
            
            </div>

            <div className='News'>
            <h3>News Portal</h3>
            </div>

            

    </div>
    <Outlet /> {/* This is where child components will render */}
    <Footer/>
    </div>
  )
}
