const Player = require("./player");

class Game {
	constructor(classId, sets) {
		this.classId = classId;
		this.sets = sets;
		this.players = {};
		// question in the form:  {term, options: [flashCardOption, flashCardOption, flashCardOption, flashCardOption], answerIndex}
		this.questions = [];
		// index of the question in the current round
		this.currentQuestionIndex = null;
		this.intervalID;
		this.secondsPast;
	}

	shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
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
		const cards = termsToUse.map((term) => term.Flashcards[0].Content);

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
		terms.forEach((term) => {
			const options = this.getFourDistinctFlashcards(terms, term);
			this.shuffle(options);
			this.questions.push({
				term: term.Content,
				options: options,
				answerIndex: options.indexOf(term.Flashcards[0].Content),
			});
		});

		this.currentQuestionIndex = 0;
	}

	getPlayerCount() {
		return Object.keys(this.players).length;
	}

	addPlayer(user) {
		const userId = user.User_Id;
		if (this.players[userId]) return false;
		const newPlayer = new Player(user);
		this.players[userId] = newPlayer;
		return true;
	}

	deletePlayer(userId) {
		if (!this.players[userId]) return false;
		delete this.players[userId];
		return true;
	}

	processAnswer(userId, answer) {
		this.players[userId].setAnswer(answer);
	}
	
	initializeTimer(maxSeconds) {
		this.secondsPast = 0;
		this.intervalID = setInterval(this.advanceTimer.bind(this), 1000, maxSeconds);
	}

	advanceTimer(maxSecond) {
		if (this.secondsPast < maxSecond)
			this.secondsPast++;
		else{
			clearInterval(this.intervalID);
			this.intervalID = null;
		}
	}

	getSecondsPast() {
		return this.secondsPast;
	}
}

module.exports = Game;
