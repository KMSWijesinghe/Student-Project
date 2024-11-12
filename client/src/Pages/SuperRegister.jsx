import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer'
import './superregister.css'

export default function SuperRegister() {
	const [url, setUrl] = useState('http://localhost:3000/SuperRegister');
    const [registerValues, setRegisterValues] = useState({
        name: '',
        email: '',
        idNo: '',
        telNo: '',
        password: ''
    });

 

    const navigate = useNavigate();

    // Handle registration form submit
    const handleRegister = (event) => {
        event.preventDefault();
        console.log("Registration form submitted");

        axios.post('http://localhost:5000/SuperRegister', registerValues)
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
		
		

        <div className='register'>
			<Header/>
            <div className="main">
                <input type="checkbox" id="chk" aria-hidden="true" />
                <div className="signup">
                    <form onSubmit={handleRegister}>
                        <label htmlFor="chk" aria-hidden="true">Sign up</label>
                        <input type="varchar" name="userName" placeholder="User name" required=""
                            onChange={e => setRegisterValues({ ...registerValues, name: e.target.value })} />
                        <input type="email" name="email" placeholder="Email" required=""
                            onChange={e => setRegisterValues({ ...registerValues, email: e.target.value })} />
                        <input type="varchar" name="idNo" placeholder="ID No." required=""
                            onChange={e => setRegisterValues({ ...registerValues, idNo: e.target.value })} />
                        <input type="varchar" name="telNo" placeholder="Telephone No" required=""
                            onChange={e => setRegisterValues({ ...registerValues, telNo: e.target.value })} />
                        <input type="password" name="password" placeholder="Password" required=""
                            onChange={e => setRegisterValues({ ...registerValues, password: e.target.value })} />
                        <button type='submit'>Sign up</button>
                    </form>
                </div>

                
            </div>
			<Footer/>
        </div>
    );
}
