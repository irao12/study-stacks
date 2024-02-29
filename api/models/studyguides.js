const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
	class Study_Guides extends Model {}

	Study_Guides.init(
		{
			Class_Id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Study_Guides",
		}
	);

	Study_Guides.associate = (models) => {};

	return Study_Guides;
};
