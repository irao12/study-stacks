"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (process.env.NODE_ENV == "production") {
	sequelize = new Sequelize(
		process.env.DB_DATABASE,
		process.env.DB_USER,
		process.env.DB_PASS,
		{
			host: process.env.DB_HOST,
			dialect: "mssql",
			dialectOptions: {
				ssl: {
					rejectUnauthorized: false,
				},
			},
		}
	);
} else {
	sequelize = new Sequelize(
		config.database,
		config.username,
		config.password,
		config
	);
}

sequelize
	.authenticate()
	.then(() => {
		console.log("Connection successful!");
	})
	.catch((err) => {
		console.log("Error connecting to database!");
	});

fs.readdirSync(__dirname)
	.filter((file) => {
		return (
			file.indexOf(".") !== 0 &&
			file !== basename &&
			file.slice(-3) === ".js"
		);
	})
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(
			sequelize,
			Sequelize.DataTypes
		);
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
