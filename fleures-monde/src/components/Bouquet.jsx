import React from "react";

function Bouquet({ bouquet, onLike }) {
  return (
    <div className="card h-100">
      <img 
        src={bouquet.image} 
        className="card-img-top"
        alt={bouquet.nom}
        style={{ height: "200px", objectFit: "cover" }}
      />

      <div className="card-body">
        <h5>{bouquet.nom}</h5>
        <p>{bouquet.descr}</p>
        <p><strong>Prix : {bouquet.prix} DZD</strong></p>
      </div>

      <div className="card-footer d-flex justify-content-between align-items-center">
        <button className="btn btn-danger" onClick={() => onLike(bouquet.id)}>
          ❤️ Like
        </button>

        {/* Le compteur de likes dehors du bouton */}
        <span><strong>{bouquet.likes} Likes</strong></span>
      </div>
    </div>
  );
}

export default Bouquet;
