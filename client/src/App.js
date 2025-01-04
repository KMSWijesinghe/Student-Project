//import logo from './logo.svg';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './Pages/Home';
import RegisterStudent from './Pages/RegisterStudent';
import SuperRegister from './Pages/SuperRegister';
import Login from './Pages/Login';
import DragAndDrop from "./components/DragAndDrop";
import RegistrationProcess from "./Pages/RegistrationProcess";
import File_Upload from "./components/File_Upload";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Review_Upload from "./Pages/Review_Upload";
import AdminHome from "./pages/AdminHome";
import Admin from "./pages/Admin";




function App() {
  return (
    <div className ="App">
    
      <BrowserRouter>
      <Routes>
        
          <Route index element={<Home/>} />
          <Route path="/RegisterStudent" element={<RegisterStudent/>} />
          <Route path="/SuperRegister" element={<SuperRegister/>} />
          <Route path="/Login" element={<Login/>} />
          <Route path="/RegistrationProcess" element={<RegistrationProcess/>} />
         <Route path="/file_Upload" element={<File_Upload/>} />
         <Route path="/Review_Upload" element={<Review_Upload/>} />
         <Route path="/AdminHome" element={<AdminHome/>} />
         <Route path="/Admin" element={<Admin/>} />
          
        
      </Routes>
    </BrowserRouter>
   </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App;