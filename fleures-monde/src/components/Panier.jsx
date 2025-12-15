import React, { useState } from "react";
import { useSelector } from "react-redux";
import { postData } from "../comm/myFetch";

function Panier({ items = [] }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      alert("Vous devez être connecté pour effectuer un achat");
      return;
    }

    if (items.length === 0) {
      alert("Votre panier est vide");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Envoyer la commande avec le token JWT
      const response = await postData("/api/transactions", {
        bouquets: items,
        token: token // Le token est déjà dans les headers via myFetch
      });

      setMessage("Achat effectué avec succès !");
      console.log("Transaction:", response);
    } catch (err) {
      setMessage("Erreur lors de l'achat: " + err.message);
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  const total = items.reduce((sum, item) => sum + (item.prix * item.quantite), 0);

  return (
    <div className="card">
      <div className="card-header bg-danger text-white">
        <h5>Mon Panier</h5>
      </div>
      <div className="card-body">
        {items.length === 0 ? (
          <p className="text-muted">Votre panier est vide</p>
        ) : (
          <>
            <ul className="list-group mb-3">
              {items.map((item, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between">
                  <span>{item.nom} x {item.quantite}</span>
                  <strong>{item.prix * item.quantite} DZD</strong>
                </li>
              ))}
            </ul>
            
            <div className="d-flex justify-content-between mb-3">
              <strong>Total:</strong>
              <strong>{total} DZD</strong>
            </div>

            <button
              className="btn btn-success w-100"
              onClick={handlePurchase}
              disabled={loading || !isAuthenticated}
            >
              {loading ? "Traitement..." : "Valider l'achat"}
            </button>

            {message && (
              <div className={`alert ${message.includes("succès") ? "alert-success" : "alert-danger"} mt-3`}>
                {message}
              </div>
            )}

            {!isAuthenticated && (
              <div className="alert alert-warning mt-3">
                Vous devez être connecté pour effectuer un achat
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Panier;