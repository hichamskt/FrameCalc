import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";

import ContactPage from "./Pages/ContactPage";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./Pages/Layout";
import NewSketch from "./Pages/NewSketch";
import Sketches from "./Pages/Sketches";
import { Toaster } from "react-hot-toast";
import Quotations from "./Pages/Quotations";
import AlucobondCutting from "./Pages/AlucobondCutting";
import Community from "./Pages/Community";
import Settings from "./Pages/Settings";
import CompanySettings from "./Pages/CompanySettings";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/contact" element={<ContactPage />} />

        <Route
          path="/dash"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dash/newsketsh" element={<NewSketch />} />
          <Route path="/dash/sketches" element={<Sketches />} />
          <Route path="/dash/quotations" element={<Quotations />} />
          <Route path="/dash/alcubond" element={<AlucobondCutting />} />
          <Route path="/dash/Commonty" element={< Community />} />
          <Route path="/dash/Settings" element={< Settings />} />
          <Route path="/dash/company-settings" element={< CompanySettings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
