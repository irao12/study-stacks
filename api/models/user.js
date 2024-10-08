const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
	class User extends Model {}

	User.init(
		{
			User_Id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			First_Name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			Last_Name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			Email: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validate: {
					isEmail: true,
				},
			},
			Password_Hash: {
				type: DataTypes.STRING,
			},
			Password: {
				type: DataTypes.VIRTUAL,
				validate: {
					isLongEnough: (val) => {
						if (val.length < 6) {
							throw new Error(
								"Password must have at least 7 characters"
							);
						}
					},
				},
			},
			Experience: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
		},
		{
			sequelize,
			timestamps: false,
			createdAt: false,
			updatedAt: false,
			modelName: "User",
		}
	);

	User.associate = (models) => {
		User.belongsToMany(models.Class, {
			through: models.ClassAccess,
			foreignKey: "User_Id",
		});

		User.hasMany(models.Class, {
			foreignKey: "User_Id",
			as: "OwnedClasses",
		});

		User.hasMany(models.Flashcard, {
			foreignKey: "User_Id",
			onDelete: "CASCADE",
		});
	};

	User.beforeSave((user, options) => {
		if (user.Password) {
			user.Password_Hash = bcrypt.hashSync(user.Password, 10);
		}
	});

	return User;
};
