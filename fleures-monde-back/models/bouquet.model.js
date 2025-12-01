module.exports = (dataB, orm) => {
  const Bouquet = dataB.define("bouquet", {
    nom: {
      type: orm.STRING,
      allowNull: false
    },
    description: {
      type: orm.TEXT
    },
    image: {
      type: orm.STRING
    },
    prix: {
      type: orm.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    totalLikes: {
      type: orm.INTEGER,
      defaultValue: 0
    }
  });

  return Bouquet;
};