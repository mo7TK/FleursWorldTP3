import React, { useState, useEffect } from "react";

function EditBouquetModal({ bouquet, show, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    image: "",
    prix: 0
  });

  useEffect(() => {
    if (bouquet) {
      setFormData({
        nom: bouquet.nom || "",
        description: bouquet.description || "",
        image: bouquet.image || "",
        prix: bouquet.prix || 0
      });
    }
  }, [bouquet]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(bouquet.id, formData);
  };

  if (!show) return null;

  return (
    <div 
      className="modal show d-block" 
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div 
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modifier le bouquet</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nom *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Prix (DZD)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.prix}
                  onChange={(e) => setFormData({...formData, prix: parseFloat(e.target.value)})}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditBouquetModal;