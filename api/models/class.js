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
			User_Id: {
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

	Class.associate = (models) => {
		Class.belongsToMany(models.User, {
			through: models.ClassAccess,
			foreignKey: "Class_Id",
			onDelete: "CASCADE",
		});

		Class.belongsTo(models.User, {
			foreignKey: "User_Id",
			as: "Owner",
		});

		Class.hasMany(models.Set, {
			foreignKey: "Class_Id",
			onDelete: "CASCADE",
		});
	};

	return Class;
};
