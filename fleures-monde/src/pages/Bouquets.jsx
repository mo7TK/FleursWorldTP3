import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Bouquet from "../components/Bouquet";
import { fetchData, postData } from "../comm/myFetch";

function Bouquets() {
  const [bouquets, setBouquets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Charger les bouquets
  const loadBouquets = async () => {
    try {
      const data = await fetchData("/api/bouquets");
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
  }, [isAuthenticated]); // Recharger si l'authentification change

  // Fonction like/unlike
  const handleLike = async (id) => {
    if (!isAuthenticated) {
      alert("Vous devez être connecté pour liker un bouquet");
      return;
    }

    try {
      await postData(`/api/bouquets/${id}/like`, {});
      // Recharger les bouquets après like
      await loadBouquets();
    } catch (err) {
      console.error("Erreur lors du like:", err);
      if (err.message.includes("401")) {
        alert("Session expirée. Veuillez vous reconnecter.");
      } else {
        setError(err.message);
      }
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
      
      {!isAuthenticated && (
        <div className="alert alert-warning">
          <strong>Note :</strong> Connectez-vous pour voir les prix et liker les bouquets !
        </div>
      )}

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