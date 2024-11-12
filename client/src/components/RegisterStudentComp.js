import './registerstudentcomp.css'
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function RegisterStudentComp() {
	const [url, setUrl] = useState('http://localhost:3000/');
    const [registerValues, setRegisterValues] = useState({
        name: '',
        email: '',
        telNo: '',
		supName: '',
		field: '',
        password: ''
    });

 

    const navigate = useNavigate();

    // Handle registration form submit
    const handleRegister = (event) => {
        event.preventDefault();
        console.log("Registration form submitted");

        axios.post('http://localhost:5000/RegisterStudentComp', registerValues)
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
	


    <div class="main">  	
		<input type="checkbox" id="chk" aria-hidden="true"/>

			<div class="signup">
				<form onSubmit={handleRegister}>
					<label for="chk" aria-hidden="true">Sign up</label>
					
					<input type="varchar" name="name" placeholder="User name" required=""
					onChange={e => setRegisterValues({ ...registerValues, name: e.target.value })}/>
					
					<input type="email" name="email" placeholder="Email" required=""
					onChange={e => setRegisterValues({ ...registerValues, email: e.target.value })}/>

          <input type="varchar" name="telNo" placeholder="Telephone No" required=""
		  onChange={e => setRegisterValues({ ...registerValues, telNo: e.target.value })}/>

          <input type="varchar" name="supName" placeholder="Supervisor Name" required=""
		  onChange={e => setRegisterValues({ ...registerValues, supName: e.target.value })}/>

          <select type="enum" name="field" id="field">
          <option value="PhD">PhD</option>
          <option value="MPhil">MPhil</option>
          </select>
          
					<input type="password" name="password" placeholder="Password" required=""
					onChange={e => setRegisterValues({ ...registerValues, password: e.target.value })}/>

					<button>Sign up</button>
				</form>
			</div>

	</div>
   
  )
}
