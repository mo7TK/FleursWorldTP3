const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Vite default port
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(
  session({
    secret: "fleures-monde-secret-key-2025",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Database
const db = require("./models");
const seedDatabase = require("./utils/seed");

// Sync database
// force: false => Don't drop existing tables
// force: true => Drop and recreate tables (use only in development!)
db.sequelize
  .sync({ force: false })
  .then(async () => {
    console.log("✓ Database synchronized successfully");

    // Seed the database with test data
    await seedDatabase();
  })
  .catch((err) => {
    console.log("✗ Database synchronization failed: " + err.message);
  });

// Routes
require("./routes/bouquet.routes")(app);
require("./routes/fleur.routes")(app);
require("./routes/backoffice.routes")(app);
// Simple test route
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'API Fleurs Monde!" });
});

// Legacy route for compatibility (redirects to new API)
app.post("/like", async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    const Bouquet = db.bouquets;

    const bouquet = await Bouquet.findByPk(id);

    if (bouquet) {
      bouquet.totalLikes++;
      await bouquet.save();
      res.json({
        id: bouquet.id,
        nom: bouquet.nom,
        descr: bouquet.description,
        image: bouquet.image,
        prix: bouquet.prix,
        likes: bouquet.totalLikes,
      });
    } else {
      res.status(404).json({ message: "Bouquet non trouvé" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Request monitoring
let requestCount = 0;
app.use((req, res, next) => {
  requestCount++;
  next();
});

setInterval(() => {
  console.log(
    `Requêtes reçues dans les 10 dernières secondes: ${requestCount}`
  );
  requestCount = 0;
}, 10000);

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});

module.exports = app;
