class Player {
	constructor(user) {
		this.User_Id = user.User_Id;
		this.First_Name = user.First_Name;
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
