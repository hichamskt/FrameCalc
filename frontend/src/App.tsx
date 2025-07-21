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

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/contact" element={<ContactPage />} />

      <Route path="/dash" element={<Layout />}>
        <Route
          path="/dash/newsketsh"
          element={
            <ProtectedRoute>
              <NewSketch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dash/sketches"
          element={
            <ProtectedRoute>
              <Sketches />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
