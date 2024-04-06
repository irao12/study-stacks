const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Set extends Model {}

	Set.init(
		{
			Set_Id: {
				primaryKey: true,
				type: DataTypes.INTEGER,
				autoIncrement: true,
			},
			Name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			Class_Id: {
				type: DataTypes.INTEGER,
			},
		},
		{
			sequelize,
			modelName: "Set",
			timestamps: false,
			createdAt: false,
			updatedAt: false,
		}
	);

	Set.associate = (models) => {
		Set.belongsTo(models.Class, { foreignKey: "Class_Id" });
		Set.hasMany(models.Term, { foreignKey: "Set_Id" });
	};

	return Set;
};
