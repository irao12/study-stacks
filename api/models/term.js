const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Term extends Model {}

	Term.init(
		{
			Term_Id: {
				primaryKey: true,
				type: DataTypes.INTEGER,
				autoIncrement: true,
			},
			Content: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Term",
			timestamps: false,
			createdAt: false,
			updatedAt: false,
		}
	);

	Term.associate = (models) => {
		Term.belongsTo(models.Set, {
			foreignKey: "Set_Id",
			onDelete: "CASCADE",
		});

		Term.hasMany(models.Flashcard, {
			foreignKey: "Term_Id",
			onDelete: "CASCADE",
		});

		Term.hasOne(models.Summary, {
			foreignKey: "Term_Id",
			onDelete: "CASCADE",
		});
	};

	return Term;
};
