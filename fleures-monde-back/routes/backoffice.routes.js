module.exports = app => {
  const db = require("../models");
  const Bouquet = db.bouquets;
  const Fleur = db.fleurs;
  var router = require("express").Router();

  // Middleware to check if user is authenticated (simplified)
  const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
      next();
    } else {
      res.status(401).json({ message: "Non authentifié" });
    }
  };

  // Get current draft bouquet from session
  router.get("/draft", isAuthenticated, (req, res) => {
    const draft = req.session.bouquetDraft || null;
    res.json({ draft });
  });

  // Save bouquet draft to session
  router.post("/draft", isAuthenticated, (req, res) => {
    try {
      // Store the draft in session
      req.session.bouquetDraft = {
        nom: req.body.nom,
        description: req.body.description,
        image: req.body.image,
        prix: req.body.prix,
        fleurs: req.body.fleurs || [], // Array of {fleurId, quantite}
        lastModified: new Date()
      };

      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ message: "Erreur de sauvegarde de session" });
        }
        res.json({ 
          message: "Brouillon sauvegardé",
          draft: req.session.bouquetDraft 
        });
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Finalize and create the bouquet
  router.post("/finalize", isAuthenticated, async (req, res) => {
    try {
      const draft = req.session.bouquetDraft;
      
      if (!draft) {
        return res.status(400).json({ message: "Aucun brouillon trouvé" });
      }

      // Create the bouquet
      const bouquet = await Bouquet.create({
        nom: draft.nom,
        description: draft.description,
        image: draft.image,
        prix: draft.prix,
        totalLikes: 0
      });

      // Add flowers to the bouquet
      if (draft.fleurs && Array.isArray(draft.fleurs)) {
        for (const fleur of draft.fleurs) {
          await bouquet.addFleur(fleur.fleurId, { 
            through: { quantite: fleur.quantite } 
          });
        }
      }

      // Clear the draft from session
      req.session.bouquetDraft = null;
      req.session.save();

      res.json({ 
        message: "Bouquet créé avec succès",
        bouquet 
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Clear draft
  router.delete("/draft", isAuthenticated, (req, res) => {
    req.session.bouquetDraft = null;
    req.session.save();
    res.json({ message: "Brouillon supprimé" });
  });

  // Simple login endpoint (for demo purposes)
  router.post("/login", async (req, res) => {
    try {
      const { login, password } = req.body;
      const User = db.users;
      
      const user = await User.findOne({ where: { login } });
      
      if (user && user.password === password) {
        // In production, use proper password hashing!
        req.session.userId = user.id;
        req.session.userLogin = user.login;
        req.session.save();
        
        res.json({ 
          message: "Connexion réussie",
          user: {
            id: user.id,
            login: user.login,
            nomComplet: user.nomComplet
          }
        });
      } else {
        res.status(401).json({ message: "Identifiants incorrects" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Logout endpoint
  router.post("/logout", (req, res) => {
    req.session.destroy();
    res.json({ message: "Déconnexion réussie" });
  });

  // Get current user
  router.get("/me", isAuthenticated, async (req, res) => {
    try {
      const User = db.users;
      const user = await User.findByPk(req.session.userId);
      
      if (user) {
        res.json({
          id: user.id,
          login: user.login,
          nomComplet: user.nomComplet
        });
      } else {
        res.status(404).json({ message: "Utilisateur non trouvé" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.use('/api/backoffice', router);
};
