module.exports = (dataB, orm) => {
  const User = dataB.define("user", {
    login: {
      type: orm.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: orm.STRING,
      allowNull: false
    },
    nomComplet: {
      type: orm.STRING,
      allowNull: false
    }
  });

  return User;
};