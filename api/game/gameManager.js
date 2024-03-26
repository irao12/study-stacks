const Game = require("./Game");

class GameManager {
	constructor(io) {
		this.games = {};
		this.playerClasses = {}; // Key: userId, Value: classId
		this.io = io;
	}

	createGame(classId, sets) {
		const newGame = new Game(classId, sets, this.io);
		this.games[classId] = newGame;
		newGame.initializeGame();
		return true;
	}

	deleteGame(classId) {
		if (!this.games[classId]) return false;
		delete this.games[classId];
	}

	getGame(classId) {
		return this.games[classId];
	}

	addPlayerToGame(user, classId) {
		const userId = user.User_Id;
		if (this.playerClasses[userId] !== undefined) return false;
		if (!this.games[classId]) return false;
		this.games[classId].addPlayer(user);
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
			delete this.games[classId];

		return true;
	}

	processAnswer(userId, answer) {
		const classId = this.playerClasses[userId];
		if (classId === undefined) return false;
		const game = this.games[classId];
		game.processAnswer(userId, answer);
	}
}

module.exports = GameManager;
