import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../services/authSlice";
import { config } from "../config/config";

const API_URL = config.apiBaseUrl;

function Login() {
  const [credentials, setCredentials] = useState({ login: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Sauvegarder les données dans Redux
        dispatch(loginSuccess({
          user: data.user,
          token: data.token
        }));

        // Rediriger vers la page des bouquets
        navigate("/bouquets");
      } else {
        setError(data.message || "Erreur de connexion");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Connexion</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="login" className="form-label">
                    Login
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="login"
                    value={credentials.login}
                    onChange={(e) =>
                      setCredentials({ ...credentials, login: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({ ...credentials, password: e.target.value })
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-danger w-100"
                  disabled={loading}
                >
                  {loading ? "Connexion..." : "Se connecter"}
                </button>
              </form>

              <div className="mt-4 p-3 bg-light rounded">
                <strong>Comptes de test :</strong>
                <ul className="mb-0 mt-2">
                  <li><code>admin</code> / <code>admin123</code></li>
                  <li><code>user1</code> / <code>user123</code></li>
                  <li><code>user2</code> / <code>user123</code></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;