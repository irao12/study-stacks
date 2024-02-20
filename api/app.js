const express = require("express");
const expressSession = require("express-session");
const morgan = require("morgan");
const passport = require("./middlewares/authentication");
const db = require("./models");
const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: "10mb" }));

// setup session cookies
app.use(
	expressSession({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);

app.use(passport.initialize());
app.use(passport.session());

const logFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(logFormat));

app.use("/api", require("./controllers"));

// update DB tables based on model updates
// toggling force to true resets all tables
db.sequelize.sync({ force: false });

// start up the server
if (PORT) {
	app.listen(PORT, () => console.log(`Listening on ${PORT}`));
} else {
	console.log("===== ERROR ====\nCREATE A .env FILE!\n===== /ERROR ====");
}
