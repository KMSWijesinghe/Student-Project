
import './superregister.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const [loginValues, setLoginValues] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
	// Handle login form submit
    const handleLogin = (event) => {
        event.preventDefault();
        console.log("Login form submitted");

        if (!loginValues.email || !loginValues.password) {
            alert("Please enter both email and password");
            return;
        }

        axios.post('http://localhost:5000/Login', loginValues)
            .then(res => {
                if (res.data.Status === "Login Success") {
                    alert("Login Successful");
                    navigate('/RegistrationProcess'); // Redirect to dashboard after login
                } else {
                    alert(res.data.Status); // Display appropriate message
                }
                console.log(res);
            })
            .catch(err => {
                console.error(err);
                alert("An error occurred during login");
            });
    };
  return ( <div className='register'>
    <Header/>
    <div class="main">  	
		<input type="checkbox" id="chk" aria-hidden="true"/>

			<div class="signup">
				<form onSubmit={handleLogin}>
					<label htmlFor="chk" aria-hidden="true">Login</label>
					
					<input type="email" name="email" placeholder="Email" required=""
                     onChange={e => setLoginValues({ ...loginValues,email: e.target.value })}/>
          
         			<input type="password" name="password" placeholder="Password" required=""
                     onChange={e => setLoginValues({ ...loginValues,password: e.target.value })}/>
					<button type='submit'>Login</button>
				</form>
			</div>

			
	</div>
    <Footer/>
   </div>
  )
}