// Fonctions d'authentification utilisant Redux (Exercice 3)
import { store } from "../store";

export function isAuthenticated() {
  const state = store.getState();
  return state.auth.isAuthenticated;
}

export function whoIsAuthenticated() {
  const state = store.getState();
  if (state.auth.isAuthenticated && state.auth.user) {
    return state.auth.user.nomComplet;
  }
  return "Mon Compte";
}

export function getToken() {
  const state = store.getState();
  return state.auth.token;
}