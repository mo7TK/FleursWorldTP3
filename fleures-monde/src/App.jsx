import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Bouquets from "./pages/Bouquets";
import Fleurs from "./pages/Fleurs";
import MonCompte from "./pages/MonCompte";

function App() {
  const mesBouquets = [
    {
      id: 1,
      nom: "Bouquet de Tunis",
      descr: "Un dosage parfait de jasmins et de tulipes, des couleurs éclatantes et du soleil toute l'année chez vous",
      image: "/images/bouquetTunis.jpg",
      prix: 1500.00
    },
    {
      id: 2,
      nom: "Bouquet d'Alger",
      descr: "Un mélange merveilleux de jasmins et de senteurs méditerranéennes, des odeurs éclatantes pour égayer votre bureau",
      image: "/images/bouqetAlger.jpg",
      prix: 2000.00
    },
    {
      id: 3,
      nom: "Bouquet d'Oran",
      descr: "Un mélange merveilleux de roses et de lys, des odeurs et des couleurs",
      image: "/images/bouquetOran.jpg",
      prix: 2000.00
    }
  ];

  const menuItems = [
    { url: "/home", label: "Home" },
    { url: "/bouquets", label: "Bouquets" },
    { url: "/fleurs", label: "Fleurs" },
    { url: "/moncompte", label: "Mon Compte" },
  ];

  return (
    <Router>
      <Navbar menuItems={menuItems} />

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/bouquets" element={<Bouquets bouquets={mesBouquets} />} />
          <Route path="/fleurs" element={<Fleurs />} />
          <Route path="/moncompte" element={<MonCompte />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
