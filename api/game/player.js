class Player {
	constructor(userId) {
		this.userId = userId;
		this.currentAnswer = null;
		this.score = 0;
	}

	addToScore(pointsEarned) {
		this.score += pointsEarned;
	}

	setAnswer(answer) {
		this.currentAnswer = answer;
	}

	clearAnswer() {
		this.currentAnswer = null;
	}
}

module.exports = Player;
