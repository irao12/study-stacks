const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Flashcard extends Model {}

	Flashcard.init(
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
			modelName: "Flashcard",
		}
	);

	Flashcard.associate = (models) => {};

	return Flashcard;
};
