module.exports = app => {
  const users = require("../controllers/user.controller.js");
  const { verifyToken, requireAuth } = require("../middleware/auth.middleware.js");
  var router = require("express").Router();

  // Login
  router.post("/login", users.login);

  // Logout
  router.post("/logout", users.logout);

  // Get current user (nécessite authentification)
  router.get("/me", verifyToken, requireAuth, users.getCurrentUser);

  app.use('/api/user', router);
};