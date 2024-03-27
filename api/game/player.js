class Player {
	constructor(user) {
		this.User_Id = user.User_Id;
		this.First_Name = user.First_Name;
		this.answer = null;
		this.score = 0;
	}

	addToScore(pointsEarned) {
		this.score += pointsEarned;
	}

	setAnswer(answer) {
		this.answer = answer;
	}

	clearAnswer() {
		this.answer = null;
	}
}

module.exports = Player;
