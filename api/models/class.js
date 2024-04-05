const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Class extends Model {}

	Class.init(
		{
			Class_Id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			Owner_Id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			Name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Class",
			timestamps: false,
			createdAt: false,
			updatedAt: false,
		}
	);

	return Class;
};
