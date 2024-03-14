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
		},
		{
			sequelize,
			modelName: "Class",
		}
	);
        
	// Class.associate = (models) => {
	// 	Class.belongsTo(models.Term, { foreignKey: "Term_Id" });
	// };

	return Class;
};