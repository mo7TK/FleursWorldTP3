import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Navbar from "./components/Navbar";
import { restoreAuth } from "./services/authSlice";

// Pages
import Home from "./pages/Home";
import Bouquets from "./pages/Bouquets";
import Fleurs from "./pages/Fleurs";
import MonCompte from "./pages/MonCompte";
import Backoffice from "./pages/Backoffice";
import Login from "./components/Login";
import Panier from "./pages/Panier";

function App() {
  const dispatch = useDispatch();

  // Restaurer l'authentification au démarrage
  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  const menuItems = [
    { url: "/home", label: "Home" },
    { url: "/bouquets", label: "Bouquets" },
    { url: "/fleurs", label: "Fleurs" },
    { url: "/backoffice", label: "Back office" },
  ];

  return (
    <Router>
      <Navbar menuItems={menuItems} />

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/bouquets" element={<Bouquets />} />
          <Route path="/fleurs" element={<Fleurs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/moncompte" element={<MonCompte />} />
          <Route path="/backoffice" element={<Backoffice />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;