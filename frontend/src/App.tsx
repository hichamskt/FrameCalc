
import './App.css'
import { Routes, Route } from "react-router-dom";
import HomePage from './Pages/HomePage';

import ContactPage from './Pages/ContactPage';
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from "react"


function App() {
 
  useEffect(() => {
  AOS.init({
    duration: 800,     
    once: true,        
  });
}, []);

  return (
  <Routes>
      <Route path="/" element={<HomePage />} />
      
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  )
}

export default App

