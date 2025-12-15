import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Bouquet from "../components/Bouquet";
import EditBouquetModal from "../components/EditBouquetModal";
import { fetchData, postData } from "../comm/myFetch";
import { config } from "../config/config";

const API_URL = config.apiBaseUrl;

function Bouquets() {
  const [bouquets, setBouquets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBouquet, setEditingBouquet] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
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
    loadBouquets();

    // Polling toutes les 10 secondes
    const interval = setInterval(() => {
      loadBouquets();
    }, 10000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Fonction like/unlike
  const handleLike = async (id) => {
    if (!isAuthenticated) {
      alert("Vous devez être connecté pour liker un bouquet");
      return;
    }

    try {
      await postData(`/api/bouquets/${id}/like`, {});
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

  // Fonction supprimer
  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce bouquet ?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/bouquets/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.ok) {
        alert("Bouquet supprimé avec succès");
        await loadBouquets();
      } else {
        throw new Error("Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de la suppression: " + err.message);
    }
  };

  // Fonction modifier
  const handleEdit = (bouquet) => {
    setEditingBouquet(bouquet);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (id, formData) => {
    try {
      const response = await fetch(`${API_URL}/api/bouquets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Bouquet modifié avec succès");
        setShowEditModal(false);
        setEditingBouquet(null);
        await loadBouquets();
      } else {
        throw new Error("Erreur lors de la modification");
      }
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de la modification: " + err.message);
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
              <Bouquet 
                bouquet={b} 
                onLike={handleLike}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal de modification */}
      <EditBouquetModal
        bouquet={editingBouquet}
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingBouquet(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

export default Bouquets;