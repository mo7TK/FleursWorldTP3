import React, { useEffect, useState } from "react";
import { config } from "../config/config";

const API_URL = config.apiBaseUrl;

function Fleurs() {
  const [fleurs, setFleurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFleurs();
  }, []);

  const loadFleurs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/fleurs`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des fleurs');
      }
      const data = await response.json();
      setFleurs(data);
      setError(null);
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message);
    } finally {
      setLoading(false);
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
      <h1 className="mb-4">Nos Fleurs</h1>
      {fleurs.length === 0 ? (
        <div className="alert alert-info">
          Aucune fleur disponible pour le moment.
        </div>
      ) : (
        <div className="row">
          {fleurs.map(fleur => (
            <div key={fleur.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{fleur.nom}</h5>
                  <p className="card-text">{fleur.description}</p>
                  <p className="card-text">
                    <strong>Prix unitaire : {fleur.prixUnitaire} DZD</strong>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Fleurs;