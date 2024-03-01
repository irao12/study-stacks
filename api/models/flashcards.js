const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Flashcards extends Model {}

	Flashcards.init(
		{
			Set_Id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			Prompt: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			Content: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Flashcards",
		}
	);

	Flashcards.associate = (models) => {};

	return Flashcards;
};
