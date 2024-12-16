import React, { useState, useEffect } from 'react';
import axios from 'axios';


function Admin()  {
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
  
    const handleReviewerChange = (event) => {
      setSelectedReviewer(event.target.value);
      // Optional: Additional logic when a reviewer is selected
    };
  return (
    <div className='student'>
        <div className='studentdetails'>
            <h3>Name   : </h3>
            <h3>Email  : </h3>
            <h3>Course : </h3>
        </div>
         
         <div>
             <button className='bttn'>Download the proporsal</button>
        </div>
        
        <div className="w-full max-w-xs">
      <select 
        value={selectedReviewer}
        onChange={handleReviewerChange}
        className="form-select block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        <option value="">Select a reviewer</option>
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
            <button className='bttn'>Upload the Reviewd Document</button>

        </div>
        
    </div>
  )
}
export default Admin
