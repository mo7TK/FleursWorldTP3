import React, { useEffect, useState } from "react";
import Bouquet from "../components/Bouquet";
import { config } from "../config/config";

const API_URL = config.apiBaseUrl;

function Bouquets() {
  const [bouquets, setBouquets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les bouquets au début
  const loadBouquets = async () => {
    try {
      const response = await fetch(`${API_URL}/api/bouquets`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des bouquets');
      }
      const data = await response.json();
      setBouquets(data);
      setError(null);
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBouquets(); // premier chargement

    // Polling toutes les 10 secondes
    const interval = setInterval(() => {
      loadBouquets();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Fonction like/unlike
  const handleLike = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/bouquets/${id}/like`, { 
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: 1 }) // User ID par défaut pour le test
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du like');
      }
      
      // Recharger les bouquets après like
      await loadBouquets();
    } catch (err) {
      console.error("Erreur lors du like:", err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Erreur:</strong> {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4">Nos Bouquets</h1>
      {bouquets.length === 0 ? (
        <div className="alert alert-info">
          Aucun bouquet disponible pour le moment.
        </div>
      ) : (
        <div className="row">
          {bouquets.map(b => (
            <div key={b.id} className="col-md-4 mb-4">
              <Bouquet bouquet={b} onLike={handleLike} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bouquets;