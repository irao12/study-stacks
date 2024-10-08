const Player = require("./player");

// Game class is used to store game data
class Game {
	constructor(classId, sets, maxSeconds) {
		this.classId = classId;
		this.sets = sets;
		this.players = {};
		// question in the form:  {term, options: [flashCardOption, flashCardOption, flashCardOption, flashCardOption], answerIndex}
		this.questions = [];
		// index of the question in the current round
		this.currentQuestionIndex = null;
		this.secondsLeft;
		this.maxSeconds = maxSeconds;
	}

	shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	getRandomFlashcardFromTerm(term) {
		const randomIndex = Math.floor(Math.random() * term.Flashcards.length);
		return term.Flashcards[randomIndex];
	}

	getFourDistinctFlashcards(terms, termToInclude) {
		const otherTerms = terms.filter((term) => term != termToInclude);
		this.shuffle(otherTerms);
		// must have at least 4 terms to work
		const termsToUse = [
			termToInclude,
			otherTerms[0],
			otherTerms[1],
			otherTerms[2],
		];
		const cards = termsToUse.map((term) => {
			return this.getRandomFlashcardFromTerm(term).Content;
		});
		return cards;
	}

	initializeGame() {
		// this is where we shuffle the flashcards and create questions and answers
		const terms = [];
		this.sets.forEach((set) => {
			set.Terms.forEach((term) => {
				terms.push(term);
			});
		});
		this.shuffle(terms);
		terms.forEach((term, index) => {
			const options = this.getFourDistinctFlashcards(terms, term);
			const answer = options[0]; // answer is the first option before we shuffle
			this.shuffle(options);
			this.questions.push({
				number: index + 1,
				term: term.Content,
				options: options,
				answerIndex: options.indexOf(answer),
			});
		});

		this.currentQuestionIndex = 0;
	}

	initializeNextRound() {
		this.currentQuestionIndex++;
		const players = Object.values(this.players);
		players.forEach((player) => player.clearAnswer());
	}

	hasStarted() {
		return this.currentQuestionIndex !== null;
	}

	getPlayers() {
		const players = Object.values(this.players);
		return players.map((player) => {
			return {
				User_Id: player.User_Id,
				First_Name: player.First_Name,
				score: player.score,
			};
		});
	}

	getPlayersWithAnswers() {
		const players = Object.values(this.players);
		return players;
	}

	getPlayerAnswers() {
		const players = Object.values(this.players);
		return players.map((player) => {
			return {
				User_Id: player.User_Id,
				answer: player.answer,
			};
		});
	}

	getPlayer(userId) {
		const player = this.players[userId];
		return {
			User_Id: player.User_Id,
			First_Name: player.First_Name,
			score: player.score,
			socketId: player.socketId,
		};
	}

	getPlayerCount() {
		return Object.keys(this.players).length;
	}

	addPlayer(user, socketId) {
		const userId = user.User_Id;
		if (this.players[userId]) return false;
		const newPlayer = new Player(user, socketId);
		this.players[userId] = newPlayer;
		return true;
	}

	deletePlayer(userId) {
		if (!this.players[userId]) return false;
		delete this.players[userId];
		return true;
	}

	getCurrentQuestion() {
		if (this.currentQuestionIndex == null) return null;
		return this.questions[this.currentQuestionIndex];
	}

	getNumberOfQuestions() {
		if (!this.questions) return null;
		return this.questions.length;
	}

	processAnswer(userId, answer) {
		this.players[userId].setAnswer(answer);
		let correctAnswer = this.getCurrentQuestion()["answerIndex"];
		if (answer == correctAnswer) this.addScore(userId, answer);
	}

	getSecondsLeft() {
		return this.secondsLeft;
	}

	setSecondsLeft(seconds) {
		this.secondsLeft = seconds;
	}

	getMaxSeconds() {
		return this.maxSeconds;
	}

	addScore(userId, answer) {
		const players = Object.values(this.players);
		const remainingPlayerCount = players
			.map((player) => player.answer)
			.filter((answer) => answer === null).length;

		const ratio = (remainingPlayerCount + 1) / players.length;
		const scoreToAdd = Math.round(this.secondsLeft * ratio);
		this.players[userId].addToScore(scoreToAdd);
	}
}

module.exports = Game;
