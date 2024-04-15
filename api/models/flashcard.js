const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Flashcard extends Model {}

	Flashcard.init(
		{
			Flashcard_Id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			User_Id: {
				type: DataTypes.INTEGER,
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
			timestamps: false,
			createdAt: false,
			updatedAt: false,
		}
	);

	Flashcard.associate = (models) => {
		Flashcard.belongsTo(models.Term, {
			foreignKey: "Term_Id",
			onDelete: "CASCADE",
		});

		Flashcard.belongsTo(models.User, {
			foreignKey: "User_Id",
			onDelete: "CASCADE",
		});
	};

	return Flashcard;
};
