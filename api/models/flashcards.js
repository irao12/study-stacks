const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
	class Flashcards extends Model {}

	Flashcards.init(
		{
			Set_Id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			Prompt: {
				type: DataTypes.String,
				allowNull: false,
			},
			Content: {
				type: DataTypes.String,
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
