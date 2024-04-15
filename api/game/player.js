// Player is used to keep track of the player's state in a game
class Player {
	constructor(user, socketId = null) {
		this.User_Id = user.User_Id;
		this.First_Name = user.First_Name;
		this.answer = null;
		this.score = 0;
		this.socketId = socketId;
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
