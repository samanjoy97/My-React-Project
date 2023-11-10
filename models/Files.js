module.exports = (sequelize, DataTypes) => {
  const Files = sequelize.define("Files", {
    FileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    /* QuestionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    */
  });

  return Files;
};
