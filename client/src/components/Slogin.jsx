
import './Slogin.css'
import React ,{useState} from 'react'
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';

export default function Slogin() {
    const [values,setValues]=useState({
       
        email:'',
        
        password:''


});

const navigate = useNavigate()

const handleLogin = (event) => {
  event.preventDefault();
  console.log("Form submitted");

  axios.post('http://localhost:5000/SuperRegister', values)
      .then(res => {
          if(res.data.Status==="Success"){
              navigate('/RegistrationProcess')
          }else {
              alert("Error")
          }

  
          
          console.log(res);
          // Handle success (e.g., show a success message to the user)
      })
      .catch(err => {
          console.error(err);
          // Handle the error (e.g., show an error message to the user)
      });
}


       
  
    return (
    <div className ="login">
				<form onSubmit= {handleLogin} >
					<label  htmlFor="chk" aria-hidden="true">Login</label>
					
					<input type="varchar" name="email" placeholder="Email" required=""
					onChange={e=>setValues({...values,email:e.target.value})}/>

					<input type="varchar" name="password" placeholder="Password" required=""
					onChange={e=>setValues({...values,password:e.target.value})}/>

					<button type='submit' className ='btn btn-success'>Login</button>
					
				</form>
			</div>
  )
}
