module.exports = app => {
  const bouquets = require("../controllers/bouquet.controller.js");
  var router = require("express").Router();

  // Create a new Bouquet
  router.post("/", bouquets.create);

  // Retrieve all Bouquets
  router.get("/", bouquets.findAll);

  // Retrieve a single Bouquet with id
  router.get("/:id", bouquets.findOne);

  // Update a Bouquet with id
  router.put("/:id", bouquets.update);

  // Delete a Bouquet with id
  router.delete("/:id", bouquets.delete);

  // Delete all Bouquets
  router.delete("/", bouquets.deleteAll);

  // Like a Bouquet
  router.post("/like", bouquets.like);

  app.use('/api/bouquets', router);
};