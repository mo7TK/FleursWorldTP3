const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

// Create Sequelize instance
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  storage: dbConfig.storage,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.fleurs = require("./fleur.model.js")(sequelize, Sequelize);
db.bouquets = require("./bouquet.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);

// Define junction table models BEFORE associations

// Junction table for Bouquet-Fleur with quantity
db.BouquetFleur = sequelize.define('bouquet_fleurs', {
  quantite: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  timestamps: false
});

// Junction table for Transaction-Bouquet with quantity
db.TransactionBouquet = sequelize.define('transaction_bouquets', {
  quantite: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  timestamps: false
});

// Define associations

// 1. Bouquet-Fleur: Many-to-Many (with quantity)
db.bouquets.belongsToMany(db.fleurs, {
  through: db.BouquetFleur,
  as: "fleurs",
  foreignKey: "bouquetId"
});

db.fleurs.belongsToMany(db.bouquets, {
  through: db.BouquetFleur,
  as: "bouquets",
  foreignKey: "fleurId"
});

// 2. User-Bouquet Likes: Many-to-Many (CORRECTION ICI)
db.users.belongsToMany(db.bouquets, {
  through: {
    model: "user_likes",
    timestamps: false  // Pas de createdAt/updatedAt
  },
  as: "likedBouquets",
  foreignKey: "userId"
});

db.bouquets.belongsToMany(db.users, {
  through: {
    model: "user_likes",
    timestamps: false  // Pas de createdAt/updatedAt
  },
  as: "likedByUsers",
  foreignKey: "bouquetId"
});

// 3. Transactions
db.transactions = sequelize.define("transaction", {
  dateTransaction: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  total: {
    type: Sequelize.FLOAT,
    defaultValue: 0
  }
});

// User has many Transactions
db.users.hasMany(db.transactions, {
  foreignKey: "userId",
  as: "transactions"
});

db.transactions.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user"
});

// Transaction-Bouquet: Many-to-Many
db.transactions.belongsToMany(db.bouquets, {
  through: db.TransactionBouquet,
  as: "bouquets",
  foreignKey: "transactionId"
});

db.bouquets.belongsToMany(db.transactions, {
  through: db.TransactionBouquet,
  as: "transactions",
  foreignKey: "bouquetId"
});

module.exports = db;