const express = require("express");
const GameManager = require("./game/GameManager");
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

const test = new GameManager();
const testSet = {
	Set_Id: 1,
	Name: "Biology",
	Class_Id: 0,
	Terms: [
		{
			Term_Id: 1,
			Content: "Stomach",
			Set_Id: 1,
			Flashcards: [
				{
					Flashcard_Id: 9,
					User_Id: 1,
					Content: "Organ used for digestion",
					createdAt: "2024-03-14T23:26:47.000Z",
					updatedAt: "2024-03-14T23:26:47.000Z",
					Term_Id: 1,
				},
			],
		},
		{
			Term_Id: 2,
			Content: "Lungs",
			Set_Id: 1,
			Flashcards: [
				{
					Flashcard_Id: 6,
					User_Id: 1,
					Content:
						"Organs needed for breathing. Organs needed for breathing. Organs needed for breathing. Organs needed for breathing. Organs needed for breathing. Organs needed for breathing",
					createdAt: "2024-03-14T21:27:30.000Z",
					updatedAt: "2024-03-14T22:16:41.000Z",
					Term_Id: 2,
				},
			],
		},
		{
			Term_Id: 7,
			Content: "Brain",
			Set_Id: 1,
			Flashcards: [
				{
					Flashcard_Id: 8,
					User_Id: 1,
					Content: "The brain is an organ used for thinking.",
					createdAt: "2024-03-14T22:22:17.000Z",
					updatedAt: "2024-03-14T22:22:17.000Z",
					Term_Id: 7,
				},
			],
		},
		{
			Term_Id: 8,
			Content: "Eyes",
			Set_Id: 1,
			Flashcards: [
				{
					Flashcard_Id: 10,
					User_Id: 1,
					Content: "Organs used for seeing",
					createdAt: "2024-03-18T23:00:49.000Z",
					updatedAt: "2024-03-18T23:00:49.000Z",
					Term_Id: 8,
				},
			],
		},
	],
};

test.createGame(0, [testSet]);
test.addPlayerToGame(1, 0);
test.games[0].initializeGame();
// test.deletePlayerFromGame(1);
test.getGame(0).questions.forEach((question) => console.log(question));
