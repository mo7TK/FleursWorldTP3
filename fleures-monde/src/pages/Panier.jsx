import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../services/cartSlice";
import { useNavigate } from "react-router-dom";
import { postData } from "../comm/myFetch";

function Panier() {
  const { items, total } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleQuantityChange = (bouquetId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(bouquetId));
    } else {
      dispatch(updateQuantity({ bouquetId, quantite: parseInt(newQuantity) }));
    }
  };

  const handleRemove = (bouquetId) => {
    dispatch(removeFromCart(bouquetId));
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert("Vous devez être connecté pour valider votre commande");
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      alert("Votre panier est vide");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Préparer les données de la transaction
      const transactionData = {
        bouquets: items.map(item => ({
          id: item.bouquet.id,
          quantite: item.quantite,
          prix: item.bouquet.prix
        })),
        total: total
      };

      // Envoyer la commande
      const response = await postData("/api/transactions", transactionData);
      
      setMessage("✅ Commande validée avec succès !");
      dispatch(clearCart());
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setMessage("❌ Erreur lors de la validation: " + err.message);
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4>Authentification requise</h4>
          <p>Vous devez être connecté pour accéder à votre panier.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Mon Panier</h1>

      {message && (
        <div className={`alert ${message.includes("✅") ? "alert-success" : "alert-danger"}`}>
          {message}
        </div>
      )}

      {items.length === 0 ? (
        <div className="alert alert-info">
          <h4>Votre panier est vide</h4>
          <p>Parcourez nos bouquets et ajoutez vos favoris au panier !</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate("/bouquets")}
          >
            Voir les bouquets
          </button>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header bg-danger text-white">
                <h5 className="mb-0">Articles ({items.length})</h5>
              </div>
              <div className="card-body">
                {items.map((item) => (
                  <div key={item.bouquet.id} className="row mb-3 pb-3 border-bottom">
                    <div className="col-md-2">
                      <img 
                        src={item.bouquet.image} 
                        alt={item.bouquet.nom}
                        className="img-fluid rounded"
                      />
                    </div>
                    <div className="col-md-4">
                      <h5>{item.bouquet.nom}</h5>
                      <p className="text-muted small">{item.bouquet.description}</p>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small">Quantité</label>
                      <input
                        type="number"
                        className="form-control"
                        value={item.quantite}
                        onChange={(e) => handleQuantityChange(item.bouquet.id, e.target.value)}
                        min="1"
                      />
                    </div>
                    <div className="col-md-2 text-center">
                      <label className="form-label small">Prix unitaire</label>
                      <p className="fw-bold">{item.bouquet.prix} DZD</p>
                    </div>
                    <div className="col-md-2 text-end">
                      <label className="form-label small">Sous-total</label>
                      <p className="fw-bold">{(item.bouquet.prix * item.quantite).toFixed(2)} DZD</p>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRemove(item.bouquet.id)}
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="btn btn-outline-danger"
              onClick={() => dispatch(clearCart())}
            >
              Vider le panier
            </button>
          </div>

          <div className="col-lg-4">
            <div className="card sticky-top" style={{ top: "20px" }}>
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Récapitulatif</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Sous-total:</span>
                  <strong>{total.toFixed(2)} DZD</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Livraison:</span>
                  <strong>Gratuite</strong>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span className="h5">Total:</span>
                  <strong className="h5 text-success">{total.toFixed(2)} DZD</strong>
                </div>

                <button
                  className="btn btn-success w-100 mb-2"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? "Traitement..." : "Valider la commande"}
                </button>

                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => navigate("/bouquets")}
                >
                  Continuer mes achats
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Panier;