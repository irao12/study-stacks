const Game = require("./Game");

// GameManager is used to update and handle game data from Game
class GameManager {
	constructor(io) {
		this.games = {}; // Key: userId, Value: game
		this.playerClasses = {}; // Key: userId, Value: classId
		this.gameIntervalMapping = {}; // Key: classId, Value: intervalId
		this.io = io;
	}

	createGame(classId, sets, maxSeconds) {
		const newGame = new Game(classId, sets, maxSeconds);
		this.games[classId] = newGame;
		return true;
	}

	startGame(classId) {
		const game = this.games[classId];
		if (!game) return;
		game.initializeGame();

		// MaxSeconds is not passing correctly
		let maxSeconds = game.getMaxSeconds();
		this.initializeTimer(classId, maxSeconds);
		this.io.to(classId).emit("timerCount", maxSeconds);
	}

	getPlayers(classId) {
		const game = this.games[classId];
		if (!game) return null;
		return game.players;
	}

	deleteGame(classId) {
		if (!this.games[classId]) return false;
		const users = Object.values(this.games[classId].players);
		const userIds = users.map((user) => user.User_Id);
		userIds.forEach((userId) => {
			console.log(userId, this.playerClasses[userId]);
			if (this.playerClasses[userId] !== undefined)
				delete this.playerClasses[userId];
		});
		delete this.games[classId];
		if (this.gameIntervalMapping[classId])
			delete this.gameIntervalMapping[classId];
	}

	getGame(classId) {
		return this.games[classId];
	}

	getGameFromUser(userId) {
		const classId = this.playerClasses[userId];
		const game = this.games[classId];
		return game;
	}

	addPlayerToGame(user, classId, socketId) {
		const userId = user.User_Id;
		if (this.playerClasses[userId] !== undefined) return false;
		if (!this.games[classId]) return false;
		this.games[classId].addPlayer(user, socketId);
		this.playerClasses[userId] = classId;
		return true;
	}

	deletePlayerFromGame(userId) {
		const classId = this.playerClasses[userId];
		if (classId === undefined) return false;
		if (this.games[classId] === undefined) return false;
		this.games[classId].deletePlayer(userId);
		delete this.playerClasses[userId];

		// delete game if no one is left
		if (this.games[classId].getPlayerCount() === 0)
			this.deleteGame(classId);

		return true;
	}

	initializeNextRound(game, classId) {
		game.initializeNextRound();
		let maxSeconds = game.getMaxSeconds();
		const nextQuestion = game.getCurrentQuestion();
		if (!nextQuestion) {
			this.io.to(classId).emit("gameEnded");
			this.deleteGame(classId);
			return;
		}
		this.io.to(classId).emit("nextRoundStarted", nextQuestion);
		this.initializeTimer(classId, maxSeconds);
		this.io.to(classId).emit("timerCount", maxSeconds);
	}

	initializeTimer(classId, maxSeconds) {
		const game = this.games[classId];
		game.secondsLeft = maxSeconds;
		this.gameIntervalMapping[classId] = setInterval(
			this.advanceTimer.bind(this),
			1000,
			classId,
			maxSeconds
		);
	}

	disableTimer(classId) {
		const intervalId = this.gameIntervalMapping[classId];
		clearInterval(intervalId);
		this.gameIntervalMapping[classId] = null;
	}

	advanceTimer(classId) {
		const game = this.games[classId];
		if (!game) this.disableTimer(classId);
		if (game.secondsLeft > 0)
			game.setSecondsLeft(game.getSecondsLeft() - 1);
		else {
			this.disableTimer(classId);
			this.initializeNextRound(game, classId);
		}

		this.io.to(classId).emit("timerCount", game.getSecondsLeft());
	}

	processAnswer(userId, answer) {
		const classId = this.playerClasses[userId];
		if (classId === undefined) return false;

		const game = this.games[classId];
		const players = Object.values(game.players);
		game.processAnswer(userId, answer);

		const remainingPlayerCount = players
			.map((player) => player.answer)
			.filter((answer) => answer === null).length;

		if (remainingPlayerCount === 0) {
			this.disableTimer(classId);
			this.initializeNextRound(game, classId);
		}
	}
}

module.exports = GameManager;
