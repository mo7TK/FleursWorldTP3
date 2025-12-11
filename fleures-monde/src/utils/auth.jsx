// Fonctions d'authentification (temporaires pour l'exercice 2)
// Ces fonctions seront modifiées dans l'exercice 3 pour utiliser Redux

// POUR TESTER : Changez true en false pour voir le bouton like grisé
const IS_AUTHENTICATED = false;

export function isAuthenticated() {
  // Pour le moment, retourne la valeur de IS_AUTHENTICATED (sera modifié dans l'exercice 3)
  return IS_AUTHENTICATED;
}

export function whoIsAuthenticated() {
  // Pour le moment, retourne "Mon Compte" ou le nom complet si authentifié (sera modifié dans l'exercice 3)
  if (IS_AUTHENTICATED) {
    return "Alice Dupont"; // Nom d'exemple pour tester
  }
  return "Mon Compte";
}