import React from 'react'
import './registerstudent.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import RegisterStudentComp from '../components/RegisterStudentComp'




export default function RegisterStudent() {
  return (
    <div className='register'>
     
    <Header/>
     <RegisterStudentComp/>
     <Footer/>   
        
    </div>
  )
}
