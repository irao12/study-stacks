const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
	class User extends Model {}

	User.init(
		{
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validate: {
					isEmail: true,
				},
			},
			passwordHash: {
				type: DataTypes.STRING,
			},
			password: {
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
			experience: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
		},
		{
			sequelize,
			modelName: "user",
		}
	);

	User.associate = (models) => {};

	User.beforeSave((user, options) => {
		if (user.password) {
			user.passwordHash = bcrypt.hashSync(user.password, 10);
		}
	});

	return User;
};
