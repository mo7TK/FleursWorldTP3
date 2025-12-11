import React from "react";
import { Link } from "react-router-dom";
import { isAuthenticated, whoIsAuthenticated } from "../utils/auth";

function Navbar({ menuItems }) {
  const authenticated = isAuthenticated();
  const userName = whoIsAuthenticated();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-danger">
      <div className="container">
        <Link className="navbar-brand me-4 text-white" to="/home">
          Fleurs Monde
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {menuItems.map((item, index) => (
              <li className="nav-item" key={index}>
                <Link className="nav-link text-white" to={item.url}>
                  {item.label}
                </Link>
              </li>
            ))}
            
            {/* Menu Mon Compte - affiche le nom complet si authentifié */}
            <li className="nav-item">
              <Link className="nav-link text-white" to="/moncompte">
                {userName}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;