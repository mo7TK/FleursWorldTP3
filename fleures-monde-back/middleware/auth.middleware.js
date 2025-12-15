const jwt = require("jsonwebtoken");

const SECRET_KEY = "fleures-monde-secret-jwt-key-2025"; // En production, utilisez une variable d'environnement

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  // Récupérer le token depuis l'en-tête Authorization
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

  if (!token) {
    // Pas de token = utilisateur non authentifié, mais on continue
    req.user = null;
    return next();
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Ajouter les infos utilisateur à la requête
    next();
  } catch (err) {
    // Token invalide ou expiré
    req.user = null;
    next();
  }
};

// Middleware pour exiger l'authentification
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: "Authentification requise" 
    });
  }
  next();
};

module.exports = { verifyToken, requireAuth, SECRET_KEY };