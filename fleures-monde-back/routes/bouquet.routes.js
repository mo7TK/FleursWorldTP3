module.exports = app => {
  const bouquets = require("../controllers/bouquet.controller.js");
  const { verifyToken, requireAuth } = require("../middleware/auth.middleware.js");
  var router = require("express").Router();

  // Appliquer le middleware verifyToken à toutes les routes
  router.use(verifyToken);

  // Create a new Bouquet
  router.post("/", bouquets.create);

  // Retrieve all Bouquets
  router.get("/", bouquets.findAll);

  // Like/Unlike a Bouquet (nécessite authentification)
  router.post("/:id/like", requireAuth, bouquets.like);

  // Get likes count for a bouquet
  router.get("/:id/likes", bouquets.getLikesCount);

  // Get users who liked a bouquet
  router.get("/:id/liked-by", bouquets.getLikedByUsers);

  // Retrieve a single Bouquet with id
  router.get("/:id", bouquets.findOne);

  // Update a Bouquet with id
  router.put("/:id", bouquets.update);

  // Delete a Bouquet with id
  router.delete("/:id", bouquets.delete);

  app.use('/api/bouquets', router);
};