import React, { useState } from 'react'
import '../components/file_upload.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

import axios from 'axios'

function Review_Upload(){
  const[file,setFile]=useState();


  const handleFile = (e) => {
     setFile(e.target.files[0])
  }

const handleUpload=()=>{
  const formdata = new FormData();
  formdata.append('pdf',file);
  axios.post('http://localhost:5000/Review_Upload',formdata)
  .then(res=>console.log(res))
  .catch(err =>console.log(err));
}


  return (
    <div className='register'>
      <Header/>
            <div className="mains">
                <input type="checkbox" id="chk" aria-hidden="true" />
                <div className="signup">
                    <form >
                        <label htmlFor="chk" aria-hidden="true">Review Report</label>
                       
                             <div >
                              <input
                                  type="file"
                                  onChange={handleFile}
                                    />
                                </div>
                        <button onClick={handleUpload} type='submit'>SUBMIT</button>
                    </form>
                </div>

                
            </div>
			<Footer/>


    </div>
  )
}


export default Review_Upload