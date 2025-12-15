import axios from "axios";
import { config } from "../config/config";
import { getToken } from "../utils/auth";

export async function myFetch(endpoint, options = {}) {
  const url = `${config.apiBaseUrl}${endpoint}`;
  const token = getToken();

  // Ajouter le header Authorization si le token existe
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (config.useAxios) {
    // Axios
    const method = options.method || "GET";
    const data = options.body || null;
    const response = await axios({ 
      url, 
      method, 
      data, 
      headers 
    });
    return response.data;
  } else {
    // Fetch
    const fetchOptions = {
      ...options,
      headers
    };
    const res = await fetch(url, fetchOptions);
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Erreur réseau" }));
      throw new Error(error.message || `Erreur ${res.status}`);
    }
    
    return await res.json();
  }
}

// Fonction spécifique pour les requêtes GET
export async function fetchData(endpoint) {
  return await myFetch(endpoint, { method: "GET" });
}

// Fonction spécifique pour les requêtes POST
export async function postData(endpoint, data) {
  return await myFetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}