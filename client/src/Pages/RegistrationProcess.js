import React, { useEffect,useState } from 'react'
import './registrationProcess.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom';
import DragAndDrop from '../components/DragAndDrop'

import { Link } from 'react-router-dom';
import axios from 'axios'


 
function RegistrationProcess() {
  
  
  const navigate = useNavigate();

const[auth,setAuth]=useState(false);
const[message,setMessage] = useState('')
const[name,setName]=useState('')

axios.defaults.withCredentials = true;

useEffect(()=>{
  axios.post('http://localhost:5000/RegistrationProcess')
            .then(res => {
                if (res.data.Status === "Registration Success") {
					          setAuth(true)
                    setName(res.data.name)
                    navigate('/Login')
                } else {
                    setAuth(false)
                    setMessage(res.data.error)
                   
                }
            
})
})

  return ( <div className='registers'>
    
    <div>
        <Header/>

        { 
             auth ?
           <div>
          <h2>You are Autherized--{name}</h2>
           <button classname='btn login'>Logout</button>
           </div>
           :
           <div>
            <h3>Not work Properly</h3>
           </div>
          

             }

         
    <div class="containers">

          
           

    <div>
    <Link to="/File_Upload">
      <button className='btn'> Submit The Proposal</button>
      </Link>
    </div>
    <div>
    <Link to="/Review_Upload">
      <button className='btn'>Review Report</button>
      </Link>
      
   
    </div>
    <div>
    <Link to="/File_Upload">
      <button className='btn'>Submit The Corrected proporsal</button>
      </Link>
    </div>
    <div>
    <Link to="/File_Upload">
      <button className='btn'>Approved Finale Proposal</button>
      </Link>
    </div>
        
        <button class="proceed-btn">Proceed</button>

    </div>
    <Footer/>  

    </div>
    </div>
    
  )
}

export default RegistrationProcess;
