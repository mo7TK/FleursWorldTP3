module.exports = (dataB, orm) => {
  const Fleur = dataB.define("fleur", {
    nom: {
      type: orm.STRING,
      allowNull: false
    },
    description: {
      type: orm.TEXT
    },
    prixUnitaire: {
      type: orm.FLOAT,
      allowNull: false,
      defaultValue: 0
    }
  });

  return Fleur;
};