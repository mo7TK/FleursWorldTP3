import React, { useState } from "react";
import { isAuthenticated } from "../utils/auth";

function Bouquet({ bouquet, onLike }) {
  const authenticated = isAuthenticated();
  const [showLikedUsers, setShowLikedUsers] = useState(false);

  const handleLikeClick = () => {
    if (authenticated) {
      onLike(bouquet.id);
    }
  };

  const handleShowLikedUsers = () => {
    setShowLikedUsers(!showLikedUsers);
  };

  return (
    <div className="card h-100">
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
        <div className="d-flex justify-content-between align-items-center">
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