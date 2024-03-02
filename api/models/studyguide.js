const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Study_Guide extends Model {}

	Study_Guide.init(
		{
			Class_Id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Study_Guide",
		}
	);

	Study_Guide.associate = (models) => {};

	return Study_Guide;
};
