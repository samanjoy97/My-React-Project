module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define("Questions", {
    ClassroomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    questionText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    questionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    options: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    marks: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Questions.associate = (models) => {
    Questions.hasMany(models.Files, {
      onDelete: "cascade",
    });
  };

  return Questions;
};
