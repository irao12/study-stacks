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
			Term: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Term",
			createdAt: false,
			updatedAt: false,
		}
	);

	Term.associate = (models) => {
		Term.belongsTo(models.Set, {
			foreignKey: "Set_Id",
		});
	};

	return Term;
};
