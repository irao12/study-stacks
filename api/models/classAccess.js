const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class ClassAccess extends Model {}

	ClassAccess.init(
		{},
		{
			sequelize,
			modelName: "ClassAccess",
			tableName: "ClassAccess",
			timestamps: false,
			createdAt: false,
			updatedAt: false,
		}
	);

	return ClassAccess;
};
