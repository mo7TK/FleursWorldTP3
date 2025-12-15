const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { SECRET_KEY } = require("../middleware/auth.middleware");

const User = db.users;

// Login / Authentification
exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ 
        message: "Login et mot de passe requis" 
      });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ where: { login } });

    if (!user) {
      return res.status(401).json({ 
        message: "Identifiants incorrects" 
      });
    }

    // Vérifier le mot de passe
    // Pour le moment, comparaison simple (sera amélioré avec bcrypt)
    const isPasswordValid = user.password === password;

    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: "Identifiants incorrects" 
      });
    }

    // Créer le token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        login: user.login,
        nomComplet: user.nomComplet 
      },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    // Retourner le token et les infos utilisateur
    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        login: user.login,
        nomComplet: user.nomComplet
      }
    });
  } catch (err) {
    res.status(500).json({ 
      message: err.message || "Erreur lors de la connexion" 
    });
  }
};

// Logout (côté client surtout, on retourne juste un message)
exports.logout = (req, res) => {
  res.json({ 
    message: "Déconnexion réussie" 
  });
};

// Obtenir l'utilisateur courant (avec le token)
exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        message: "Non authentifié" 
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        message: "Utilisateur non trouvé" 
      });
    }

    res.json({
      id: user.id,
      login: user.login,
      nomComplet: user.nomComplet
    });
  } catch (err) {
    res.status(500).json({ 
      message: err.message || "Erreur lors de la récupération de l'utilisateur" 
    });
  }
};