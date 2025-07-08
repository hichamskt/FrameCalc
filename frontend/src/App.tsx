
import './App.css'
import { Routes, Route } from "react-router-dom";
import HomePage from './Pages/HomePage';
import AboutPage from './Pages/AboutPage';
import ContactPage from './Pages/ContactPage';

function App() {
 

  return (
  <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage/>} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  )
}

export default App

