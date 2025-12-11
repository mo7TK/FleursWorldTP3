import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/api';

// Composant de connexion
function LoginForm({ onLogin }) {
  const [credentials, setCredentials] = useState({ login: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/backoffice/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });
      
      if (response.ok) {
        const data = await response.json();
        onLogin(data.user);
      } else {
        setError('Identifiants incorrects');
      }
    } catch (err) {
      setError('Erreur de connexion');
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h3 className="card-title text-center mb-4">Connexion Backoffice</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <div>
          <div className="mb-3">
            <label className="form-label">Login</label>
            <input
              type="text"
              className="form-control"
              value={credentials.login}
              onChange={(e) => setCredentials({...credentials, login: e.target.value})}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>
          <button onClick={handleSubmit} className="btn btn-danger w-100">
            Se connecter
          </button>
          <div className="mt-3 text-muted small">
            <strong>Comptes de test:</strong><br/>
            admin / admin123
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant principal
function BouquetForm({ user, onLogout }) {
  const [fleurs, setFleurs] = useState([]);
  const [bouquet, setBouquet] = useState({
    nom: '',
    description: '',
    image: '',
    prix: 0,
    fleurs: []
  });
  const [draft, setDraft] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/fleurs`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setFleurs(data));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/backoffice/draft`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.draft) {
          setDraft(data.draft);
          setBouquet(data.draft);
        }
      });
  }, []);

  const addFleur = (fleurId) => {
    const existing = bouquet.fleurs.find(f => f.fleurId === parseInt(fleurId));
    if (existing) {
      setBouquet({
        ...bouquet,
        fleurs: bouquet.fleurs.map(f => 
          f.fleurId === parseInt(fleurId) 
            ? {...f, quantite: f.quantite + 1} 
            : f
        )
      });
    } else {
      setBouquet({
        ...bouquet,
        fleurs: [...bouquet.fleurs, { fleurId: parseInt(fleurId), quantite: 1 }]
      });
    }
  };

  const removeFleur = (fleurId) => {
    setBouquet({
      ...bouquet,
      fleurs: bouquet.fleurs.filter(f => f.fleurId !== fleurId)
    });
  };

  const updateQuantite = (fleurId, quantite) => {
    if (quantite <= 0) {
      removeFleur(fleurId);
    } else {
      setBouquet({
        ...bouquet,
        fleurs: bouquet.fleurs.map(f => 
          f.fleurId === fleurId ? {...f, quantite: parseInt(quantite)} : f
        )
      });
    }
  };

  const saveDraft = async () => {
    const response = await fetch(`${API_URL}/backoffice/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(bouquet)
    });
    if (response.ok) {
      const data = await response.json();
      setDraft(data.draft);
      setMessage('Brouillon sauvegardé !');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const finalizeBouquet = async () => {
    if (!bouquet.nom || bouquet.fleurs.length === 0) {
      alert('Le bouquet doit avoir un nom et au moins une fleur');
      return;
    }
    const response = await fetch(`${API_URL}/backoffice/finalize`, {
      method: 'POST',
      credentials: 'include'
    });
    if (response.ok) {
      setMessage('Bouquet créé avec succès !');
      setBouquet({ nom: '', description: '', image: '', prix: 0, fleurs: [] });
      setDraft(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const resetForm = async () => {
    await fetch(`${API_URL}/backoffice/draft`, {
      method: 'DELETE',
      credentials: 'include'
    });
    setBouquet({ nom: '', description: '', image: '', prix: 0, fleurs: [] });
    setDraft(null);
  };

  return (
    <div>
      <div className="bg-danger text-white p-3 mb-4 rounded">
        <div className="d-flex justify-content-between">
          <div>
            <h4>Backoffice - Création de Bouquet</h4>
            <small>Connecté: {user.nomComplet}</small>
          </div>
          <button onClick={onLogout} className="btn btn-light btn-sm">
            Déconnexion
          </button>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {draft && <div className="alert alert-info">Brouillon sauvegardé le: {new Date(draft.lastModified).toLocaleString()}</div>}

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header bg-danger text-white">
              <h5>Informations du Bouquet</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label>Nom *</label>
                <input
                  className="form-control"
                  value={bouquet.nom}
                  onChange={(e) => setBouquet({...bouquet, nom: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={bouquet.description}
                  onChange={(e) => setBouquet({...bouquet, description: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label>Image URL</label>
                <input
                  className="form-control"
                  value={bouquet.image}
                  onChange={(e) => setBouquet({...bouquet, image: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label>Prix (DZD)</label>
                <input
                  type="number"
                  className="form-control"
                  value={bouquet.prix}
                  onChange={(e) => setBouquet({...bouquet, prix: parseFloat(e.target.value)})}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-danger text-white">
              <h5>Fleurs disponibles</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {fleurs.map(f => (
                  <div key={f.id} className="col-6 mb-2">
                    <button
                      className="btn btn-outline-danger w-100"
                      onClick={() => addFleur(f.id)}
                    >
                      {f.nom}<br/>
                      <small>{f.prixUnitaire} DZD</small>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header bg-success text-white">
              <h5>Composition</h5>
            </div>
            <div className="card-body">
              {bouquet.fleurs.length === 0 ? (
                <p className="text-muted">Aucune fleur</p>
              ) : (
                bouquet.fleurs.map(bf => {
                  const fleur = fleurs.find(f => f.id === bf.fleurId);
                  return (
                    <div key={bf.fleurId} className="d-flex justify-content-between mb-2 p-2 border rounded">
                      <div>
                        <strong>{fleur?.nom}</strong><br/>
                        <small>{fleur?.prixUnitaire} × {bf.quantite} = {(fleur?.prixUnitaire || 0) * bf.quantite} DZD</small>
                      </div>
                      <div>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          style={{width: '60px', display: 'inline-block'}}
                          value={bf.quantite}
                          onChange={(e) => updateQuantite(bf.fleurId, e.target.value)}
                          min="1"
                        />
                        <button
                          className="btn btn-sm btn-danger ms-2"
                          onClick={() => removeFleur(bf.fleurId)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-warning">
              <h5>Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary"
                  onClick={saveDraft}
                  disabled={!bouquet.nom}
                >
                  💾 Sauvegarder le brouillon
                </button>
                <button
                  className="btn btn-success"
                  onClick={finalizeBouquet}
                  disabled={!bouquet.nom || bouquet.fleurs.length === 0}
                >
                  ✓ Finaliser le bouquet
                </button>
                <button className="btn btn-secondary" onClick={resetForm}>
                  🔄 Réinitialiser
                </button>
              </div>
              <div className="mt-3 alert alert-info small">
                💡 Vous pouvez sauvegarder, vous déconnecter, puis reprendre plus tard !
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Backoffice() {
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    await fetch(`${API_URL}/backoffice/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
  };

  return (
    <div className="container py-5">
      {!user ? (
        <div className="row justify-content-center">
          <div className="col-md-5">
            <LoginForm onLogin={setUser} />
          </div>
        </div>
      ) : (
        <BouquetForm user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}