const db = require("../models");
const Fleur = db.fleurs;
const Bouquet = db.bouquets;
const User = db.users;

async function seedDatabase() {
  try {
    // Check if data already exists
    const fleurCount = await Fleur.count();
    if (fleurCount > 0) {
      console.log("Database already seeded. Skipping...");
      return;
    }

    console.log("Seeding database...");

    // Create Users
    const users = await User.bulkCreate([
      {
        login: "admin",
        password: "admin123", // In production, hash this!
        nomComplet: "Administrateur Principal"
      },
      {
        login: "user1",
        password: "user123",
        nomComplet: "Alice Dupont"
      },
      {
        login: "user2",
        password: "user123",
        nomComplet: "Bob Martin"
      }
    ]);

    console.log("✓ Users created");

    // Create Fleurs
    const fleurs = await Fleur.bulkCreate([
      {
        nom: "Rose Rouge",
        description: "Belle rose rouge classique",
        prixUnitaire: 50
      },
      {
        nom: "Tulipe",
        description: "Tulipe colorée du printemps",
        prixUnitaire: 35
      },
      {
        nom: "Jasmin",
        description: "Jasmin parfumé",
        prixUnitaire: 40
      },
      {
        nom: "Lys",
        description: "Lys blanc élégant",
        prixUnitaire: 60
      },
      {
        nom: "Orchidée",
        description: "Orchidée exotique",
        prixUnitaire: 80
      }
    ]);

    console.log("✓ Fleurs created");

    // Create Bouquets
    const bouquet1 = await Bouquet.create({
      nom: "Bouquet de Tunis",
      description: "Un dosage parfait de jasmins et de tulipes, des couleurs éclatantes et du soleil toute l'année chez vous",
      image: "/images/bouquetTunis.jpg",
      prix: 1500,
      totalLikes: 0
    });

    // Add flowers to Bouquet 1
    await bouquet1.addFleur(fleurs[2].id, { through: { quantite: 5 } }); // Jasmin x5
    await bouquet1.addFleur(fleurs[1].id, { through: { quantite: 3 } }); // Tulipe x3

    const bouquet2 = await Bouquet.create({
      nom: "Bouquet d'Alger",
      description: "Un mélange merveilleux de jasmins et de senteurs méditerranéennes, des odeurs éclatantes pour égayer votre bureau",
      image: "/images/bouqetAlger.jpg",
      prix: 2000,
      totalLikes: 0
    });

    // Add flowers to Bouquet 2
    await bouquet2.addFleur(fleurs[2].id, { through: { quantite: 7 } }); // Jasmin x7
    await bouquet2.addFleur(fleurs[0].id, { through: { quantite: 2 } }); // Rose x2

    const bouquet3 = await Bouquet.create({
      nom: "Bouquet d'Oran",
      description: "Un mélange merveilleux de roses et de lys, des odeurs et des couleurs",
      image: "/images/bouquetOran.jpg",
      prix: 2000,
      totalLikes: 0
    });

    // Add flowers to Bouquet 3
    await bouquet3.addFleur(fleurs[0].id, { through: { quantite: 6 } }); // Rose x6
    await bouquet3.addFleur(fleurs[3].id, { through: { quantite: 4 } }); // Lys x4

    const bouquet4 = await Bouquet.create({
      nom: "Bouquet Premium",
      description: "Un bouquet luxueux avec des orchidées et des lys",
      image: "/images/bouquetPremium.jpg",
      prix: 3500,
      totalLikes: 0
    });

    // Add flowers to Bouquet 4
    await bouquet4.addFleur(fleurs[4].id, { through: { quantite: 3 } }); // Orchidée x3
    await bouquet4.addFleur(fleurs[3].id, { through: { quantite: 5 } }); // Lys x5

    console.log("✓ Bouquets created with flowers");

    // Add some likes
    await users[1].addLikedBouquet(bouquet1);
    bouquet1.totalLikes = 1;
    await bouquet1.save();

    await users[1].addLikedBouquet(bouquet2);
    await users[2].addLikedBouquet(bouquet2);
    bouquet2.totalLikes = 2;
    await bouquet2.save();

    console.log("✓ Likes added");

    // Create a sample transaction
    const transaction = await db.transactions.create({
      userId: users[1].id,
      dateTransaction: new Date(),
      total: 3500
    });

    await transaction.addBouquet(bouquet1.id, { through: { quantite: 1 } });
    await transaction.addBouquet(bouquet2.id, { through: { quantite: 1 } });

    console.log("✓ Sample transaction created");

    console.log("Database seeding completed successfully! ✓");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

module.exports = seedDatabase;