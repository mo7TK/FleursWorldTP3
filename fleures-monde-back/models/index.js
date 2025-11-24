const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

// Create Sequelize instance
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  storage: dbConfig.storage,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  logging: false // Set to console.log to see SQL queries
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.fleurs = require("./fleur.model.js")(sequelize, Sequelize);
db.bouquets = require("./bouquet.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);

// Define associations

// 1. Bouquet-Fleur: Many-to-Many (with quantity)
// A bouquet contains many flowers, and a flower can be in many bouquets
db.bouquets.belongsToMany(db.fleurs, {
  through: "bouquet_fleurs",
  as: "fleurs",
  foreignKey: "bouquetId"
});

db.fleurs.belongsToMany(db.bouquets, {
  through: "bouquet_fleurs",
  as: "bouquets",
  foreignKey: "fleurId"
});

// Access the junction table to add quantity field
const BouquetFleur = sequelize.models.bouquet_fleurs;
BouquetFleur.removeAttribute('id'); // Remove default id
sequelize.models.bouquet_fleurs = sequelize.define('bouquet_fleurs', {
  bouquetId: {
    type: Sequelize.INTEGER,
    references: {
      model: db.bouquets,
      key: 'id'
    },
    primaryKey: true
  },
  fleurId: {
    type: Sequelize.INTEGER,
    references: {
      model: db.fleurs,
      key: 'id'
    },
    primaryKey: true
  },
  quantite: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  timestamps: false
});

// 2. User-Bouquet Likes: Many-to-Many
// A user can like many bouquets, and a bouquet can be liked by many users
db.users.belongsToMany(db.bouquets, {
  through: "user_likes",
  as: "likedBouquets",
  foreignKey: "userId"
});

db.bouquets.belongsToMany(db.users, {
  through: "user_likes",
  as: "likedByUsers",
  foreignKey: "bouquetId"
});

// 3. Transactions (User purchases Bouquets)
// Create Transaction model
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

// Transaction-Bouquet: Many-to-Many (with quantity)
db.transactions.belongsToMany(db.bouquets, {
  through: "transaction_bouquets",
  as: "bouquets",
  foreignKey: "transactionId"
});

db.bouquets.belongsToMany(db.transactions, {
  through: "transaction_bouquets",
  as: "transactions",
  foreignKey: "bouquetId"
});

// Add quantity to transaction_bouquets junction table
const TransactionBouquet = sequelize.define('transaction_bouquets', {
  quantite: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  timestamps: false
});

module.exports = db;