import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Admin.css'
import Header from '../components/Header';
import Footer from '../components/Footer';



function Admin()  {
  const location = useLocation();
    const studentDetails = location.state?.studentDetails;
    const [reviewers, setReviewers] = useState([]);
    const [selectedReviewer, setSelectedReviewer] = useState('');
  
    useEffect(() => {
      const fetchReviewers = async () => {
        try {
          const response = await axios.get('http://localhost:5000/reviewers');
          setReviewers(response.data);
        } catch (error) {
          console.error('Error fetching reviewers:', error);
        }
      };
  
      fetchReviewers();
    }, []);


  const handleDownload = () => {
    const localFilePath = `file:///C:/Users/Sameera%20Wijesinghe/Desktop/sample_project/server/${studentDetails.proposal_file_path}`;
    window.open(localFilePath, "_blank");
  };
  
    const handleReviewerChange = (event) => {
      setSelectedReviewer(event.target.value);
      // Optional: Additional logic when a reviewer is selected
    };

    if (!studentDetails) {
      return <div>No student details available</div>;
    }

  return (
  <div className='Admin'>
    
        <div className='studentdetails'>
            <h3>Name   : {studentDetails.name} </h3>
            <h3>Email  : {studentDetails.email} </h3>
            <h3>Tel    : {studentDetails.proposal_file_path}</h3>
        </div>
     
        <div className='student'>

         <div>
             <button className='bttn' onClick={handleDownload} >Download the proporsal</button>
        </div>
        
        <div className="sellection">
      <select 
        value={selectedReviewer}
        onChange={handleReviewerChange}
        className="select_block"
      >
        
        {reviewers.map((reviewer) => (
          <option 
            key={reviewer.id} 
            value={reviewer.id.toString()}
          >
            {reviewer.name}
          </option>
        ))}
      </select>
    </div>
       
         <div>
            <button className='bttn'>Upload the Reviewed Document</button>

        </div>
        
    </div>

    <Footer/>

    </div>
  )
}
export default Admin
