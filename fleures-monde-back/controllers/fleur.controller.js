const db = require("../models");
const Fleur = db.fleurs;
const Op = db.Sequelize.Op;

// Create and save a new Fleur
exports.create = async (req, res) => {
  try {
    if (!req.body.nom) {
      res.status(400).send({
        message: "Le nom ne peut pas être vide!"
      });
      return;
    }

    const fleur = {
      nom: req.body.nom,
      description: req.body.description,
      prixUnitaire: req.body.prixUnitaire || 0
    };

    const data = await Fleur.create(fleur);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Erreur lors de la création de la Fleur."
    });
  }
};

// Retrieve all Fleurs from the database
exports.findAll = async (req, res) => {
  try {
    const data = await Fleur.findAll();
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Erreur lors de la récupération des Fleurs."
    });
  }
};

// Find a single Fleur with an id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Fleur.findByPk(id);

    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Fleur avec id=${id} non trouvée.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Erreur lors de la récupération de la Fleur avec id=" + req.params.id
    });
  }
};

// Update a Fleur by the id in the request
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await Fleur.update(req.body, {
      where: { id: id }
    });

    if (num == 1) {
      res.send({
        message: "Fleur mise à jour avec succès."
      });
    } else {
      res.send({
        message: `Impossible de mettre à jour la Fleur avec id=${id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Erreur lors de la mise à jour de la Fleur avec id=" + req.params.id
    });
  }
};

// Delete a Fleur with the specified id in the request
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await Fleur.destroy({
      where: { id: id }
    });

    if (num == 1) {
      res.send({
        message: "Fleur supprimée avec succès!"
      });
    } else {
      res.send({
        message: `Impossible de supprimer la Fleur avec id=${id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Impossible de supprimer la Fleur avec id=" + req.params.id
    });
  }
};

// Delete all Fleurs from the database
exports.deleteAll = async (req, res) => {
  try {
    const nums = await Fleur.destroy({
      where: {},
      truncate: false
    });
    res.send({ message: `${nums} Fleurs ont été supprimées avec succès!` });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Erreur lors de la suppression de toutes les Fleurs."
    });
  }
};