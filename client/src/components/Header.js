import React from 'react'
import './Header.css'
import logo from '../images/logoMed.png';


export default function Header() {
    const topic = "PhD/MPhil Student Portal"
  return (
    <header>     
	<div class="topicBox">
        <div className='logo'>
            <img className='left' src="https://www.kln.ac.lk/images/university-of-kelaniya-logo.png"  ></img> 
            <h1 className='h1'>{topic}</h1>
            <img className='right'src={logo}  ></img>
        </div>
     <h2 className='h3'>University of Kelaniya - Faculty of Medicine</h2> 
    
   

      </div>

        </header>
    
  )
}
