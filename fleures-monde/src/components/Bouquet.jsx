import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { isAuthenticated } from "../utils/auth";
import { addToCart } from "../services/cartSlice";

function Bouquet({ bouquet, onLike, onDelete, onEdit }) {
  const authenticated = isAuthenticated();
  const [showLikedUsers, setShowLikedUsers] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated: isAuth } = useSelector((state) => state.auth);

  const handleLikeClick = () => {
    if (authenticated) {
      onLike(bouquet.id);
    }
  };

  const handleShowLikedUsers = () => {
    setShowLikedUsers(!showLikedUsers);
  };

  const handleAddToCart = () => {
    if (!isAuth) {
      alert("Vous devez être connecté pour ajouter au panier");
      return;
    }
    if (!bouquet.prix) {
      alert("Prix non disponible");
      return;
    }
    dispatch(addToCart(bouquet));
  };

  return (
    <div className="card h-100 position-relative">
      {/* Boutons Modifier et Supprimer en haut à droite */}
      {authenticated && (
        <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 10 }}>
          <button
            className="btn btn-sm btn-warning me-1"
            onClick={() => onEdit(bouquet)}
            title="Modifier"
          >
            ✏️
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => onDelete(bouquet.id)}
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      )}

      <img 
        src={bouquet.image} 
        className="card-img-top"
        alt={bouquet.nom}
        style={{ height: "200px", objectFit: "cover" }}
      />

      <div className="card-body">
        <h5 className="card-title">{bouquet.nom}</h5>
        <p className="card-text">{bouquet.description || bouquet.descr}</p>
        {bouquet.prix && (
          <p className="card-text">
            <strong>Prix : {bouquet.prix} DZD</strong>
          </p>
        )}
      </div>

      <div className="card-footer">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <button 
            className={`btn ${authenticated ? 'btn-danger' : 'btn-secondary'}`}
            onClick={handleLikeClick}
            disabled={!authenticated}
            title={!authenticated ? "Vous devez être connecté pour liker" : ""}
          >
            ❤️ Like
          </button>

          {/* Compteur de likes cliquable */}
          <span 
            className="badge bg-primary"
            style={{ cursor: 'pointer', fontSize: '1rem', padding: '0.5rem' }}
            onClick={handleShowLikedUsers}
            title="Cliquez pour voir qui a liké"
          >
            {bouquet.totalLikes || bouquet.likes || 0} Likes
          </span>
        </div>

        {/* Bouton Ajouter au panier */}
        {bouquet.prix && (
          <button
            className="btn btn-success w-100"
            onClick={handleAddToCart}
            disabled={!isAuth}
          >
            🛒 Ajouter au panier
          </button>
        )}

        {/* Liste des utilisateurs qui ont liké */}
        {showLikedUsers && (
          <div className="mt-3 p-2 border rounded bg-light">
            <strong>Utilisateurs qui ont liké :</strong>
            {bouquet.likedByUsers && bouquet.likedByUsers.length > 0 ? (
              <ul className="mb-0 mt-2">
                {bouquet.likedByUsers.map((user, index) => (
                  <li key={index}>{user.nomComplet}</li>
                ))}
              </ul>
            ) : (
              <p className="mb-0 mt-2 text-muted">Aucun utilisateur n'a encore liké ce bouquet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Bouquet;