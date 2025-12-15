module.exports = app => {
  const fleurs = require("../controllers/fleur.controller.js");
  const { verifyToken } = require("../middleware/auth.middleware.js");
  var router = require("express").Router();

  // Appliquer le middleware verifyToken à toutes les routes
  router.use(verifyToken);

  // Create a new Fleur
  router.post("/", fleurs.create);

  // Retrieve all Fleurs
  router.get("/", fleurs.findAll);

  // Retrieve a single Fleur with id
  router.get("/:id", fleurs.findOne);

  // Update a Fleur with id
  router.put("/:id", fleurs.update);

  // Delete a Fleur with id
  router.delete("/:id", fleurs.delete);

  // Delete all Fleurs
  router.delete("/", fleurs.deleteAll);

  app.use('/api/fleurs', router);
};