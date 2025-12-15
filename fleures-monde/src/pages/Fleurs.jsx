import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchData } from "../comm/myFetch";

function Fleurs() {
  const [fleurs, setFleurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    loadFleurs();
  }, [isAuthenticated]); // Recharger si l'authentification change

  const loadFleurs = async () => {
    try {
      const data = await fetchData("/api/fleurs");
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

      {!isAuthenticated && (
        <div className="alert alert-warning">
          <strong>Note :</strong> Connectez-vous pour voir les prix des fleurs !
        </div>
      )}

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
                  {fleur.prixUnitaire !== undefined && (
                    <p className="card-text">
                      <strong>Prix unitaire : {fleur.prixUnitaire} DZD</strong>
                    </p>
                  )}
                  {fleur.prixUnitaire === undefined && (
                    <p className="card-text text-muted">
                      <em>Connectez-vous pour voir le prix</em>
                    </p>
                  )}
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