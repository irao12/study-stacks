const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Summary extends Model {}

	Summary.init(
		{
			Term_Id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
			},
			Content: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Summary",
		}
	);

	Summary.associate = (models) => {
		Summary.belongsTo(models.Term, {
			foreignKey: "Term_Id",
		});
	};

	return Summary;
};
