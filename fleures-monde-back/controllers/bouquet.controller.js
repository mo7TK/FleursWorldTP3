const db = require("../models");
const Bouquet = db.bouquets;
const Fleur = db.fleurs;
const User = db.users;
const Op = db.Sequelize.Op;

// Create and save a new Bouquet
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.nom) {
      res.status(400).send({
        message: "Le nom ne peut pas être vide!"
      });
      return;
    }

    // Create a Bouquet
    const bouquet = {
      nom: req.body.nom,
      description: req.body.description,
      image: req.body.image,
      prix: req.body.prix || 0,
      totalLikes: 0
    };

    // Save Bouquet in the database
    const data = await Bouquet.create(bouquet);

    // If flowers are provided, add them to the bouquet
    if (req.body.fleurs && Array.isArray(req.body.fleurs)) {
      for (const fleur of req.body.fleurs) {
        await data.addFleur(fleur.fleurId, { through: { quantite: fleur.quantite } });
      }
    }

    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Erreur lors de la création du Bouquet."
    });
  }
};

// Retrieve all Bouquets from the database
exports.findAll = async (req, res) => {
  try {
    const isAuthenticated = req.user != null;

    const data = await Bouquet.findAll({
      include: [
        {
          model: Fleur,
          as: "fleurs",
          through: { attributes: ['quantite'] }
        },
        {
          model: User,
          as: "likedByUsers",
          attributes: ['id', 'nomComplet'],
          through: { attributes: [] }
        }
      ]
    });

    // Si non authentifié, cacher les prix et les likes
    const sanitizedData = data.map(bouquet => {
      const bouquetData = bouquet.toJSON();
      
      if (!isAuthenticated) {
        // Cacher le prix du bouquet
        delete bouquetData.prix;
        // Cacher le nombre de likes
        delete bouquetData.totalLikes;
        delete bouquetData.likedByUsers;
        
        // Cacher les prix des fleurs
        if (bouquetData.fleurs) {
          bouquetData.fleurs = bouquetData.fleurs.map(fleur => {
            const fleurData = { ...fleur };
            delete fleurData.prixUnitaire;
            return fleurData;
          });
        }
      }
      
      return bouquetData;
    });

    res.send(sanitizedData);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Erreur lors de la récupération des Bouquets."
    });
  }
};

// Find a single Bouquet with an id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const isAuthenticated = req.user != null;

    const data = await Bouquet.findByPk(id, {
      include: [
        {
          model: Fleur,
          as: "fleurs",
          through: { attributes: ['quantite'] }
        },
        {
          model: User,
          as: "likedByUsers",
          attributes: ['id', 'nomComplet'],
          through: { attributes: [] }
        }
      ]
    });

    if (data) {
      const bouquetData = data.toJSON();
      
      if (!isAuthenticated) {
        delete bouquetData.prix;
        delete bouquetData.totalLikes;
        delete bouquetData.likedByUsers;
        
        if (bouquetData.fleurs) {
          bouquetData.fleurs = bouquetData.fleurs.map(fleur => {
            const fleurData = { ...fleur };
            delete fleurData.prixUnitaire;
            return fleurData;
          });
        }
      }
      
      res.send(bouquetData);
    } else {
      res.status(404).send({
        message: `Bouquet avec id=${id} non trouvé.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Erreur lors de la récupération du Bouquet avec id=" + req.params.id
    });
  }
};

// Update a Bouquet by the id in the request
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await Bouquet.update(req.body, {
      where: { id: id }
    });

    if (num == 1) {
      res.send({
        message: "Bouquet mis à jour avec succès."
      });
    } else {
      res.send({
        message: `Impossible de mettre à jour le Bouquet avec id=${id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Erreur lors de la mise à jour du Bouquet avec id=" + req.params.id
    });
  }
};

// Delete a Bouquet with the specified id in the request
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await Bouquet.destroy({
      where: { id: id }
    });

    if (num == 1) {
      res.send({
        message: "Bouquet supprimé avec succès!"
      });
    } else {
      res.send({
        message: `Impossible de supprimer le Bouquet avec id=${id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Impossible de supprimer le Bouquet avec id=" + req.params.id
    });
  }
};

// Delete all Bouquets from the database
exports.deleteAll = async (req, res) => {
  try {
    const nums = await Bouquet.destroy({
      where: {},
      truncate: false
    });
    res.send({ message: `${nums} Bouquets ont été supprimés avec succès!` });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Erreur lors de la suppression de tous les Bouquets."
    });
  }
};

// Like a Bouquet
exports.like = async (req, res) => {
  try {
    // Vérifier l'authentification
    if (!req.user) {
      return res.status(401).send({
        message: "Vous devez être authentifié pour liker un bouquet"
      });
    }

    const bouquetId = req.params.id;
    const userId = req.user.id; // Utiliser l'ID de l'utilisateur authentifié

    if (!bouquetId) {
      return res.status(400).send({
        message: "ID du bouquet manquant"
      });
    }

    const bouquet = await Bouquet.findByPk(bouquetId);
    const user = await User.findByPk(userId);

    if (!bouquet || !user) {
      return res.status(404).send({
        message: "Bouquet ou User non trouvé."
      });
    }

    // Check if user already liked this bouquet
    const hasLiked = await user.hasLikedBouquet(bouquet);

    if (hasLiked) {
      // Unlike
      await user.removeLikedBouquet(bouquet);
      bouquet.totalLikes = Math.max(0, bouquet.totalLikes - 1);
    } else {
      // Like
      await user.addLikedBouquet(bouquet);
      bouquet.totalLikes += 1;
    }

    await bouquet.save();
    
    // Return bouquet with liked users
    const updatedBouquet = await Bouquet.findByPk(bouquetId, {
      include: [{
        model: User,
        as: "likedByUsers",
        attributes: ['id', 'nomComplet'],
        through: { attributes: [] }
      }]
    });
    
    res.send(updatedBouquet);
  } catch (err) {
    console.error("Error in like controller:", err);
    res.status(500).send({
      message: err.message || "Erreur lors du like."
    });
  }
};

// Get likes count for a bouquet
exports.getLikesCount = async (req, res) => {
  try {
    const id = req.params.id;
    const bouquet = await Bouquet.findByPk(id);
    
    if (!bouquet) {
      res.status(404).send({
        message: `Bouquet avec id=${id} non trouvé.`
      });
      return;
    }
    
    res.send({
      bouquetId: id,
      totalLikes: bouquet.totalLikes
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Erreur lors de la récupération des likes."
    });
  }
};

// Get users who liked a bouquet
exports.getLikedByUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const bouquet = await Bouquet.findByPk(id, {
      include: [{
        model: User,
        as: "likedByUsers",
        attributes: ['id', 'login', 'nomComplet'],
        through: { attributes: [] }
      }]
    });
    
    if (!bouquet) {
      res.status(404).send({
        message: `Bouquet avec id=${id} non trouvé.`
      });
      return;
    }
    
    res.send({
      bouquetId: id,
      bouquetNom: bouquet.nom,
      likedByUsers: bouquet.likedByUsers
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Erreur lors de la récupération des utilisateurs."
    });
  }
};