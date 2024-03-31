module.exports = (io, socket, gameManager) => {
	const fetchSocketsInRoom = async (roomId) => {
		try {
			const sockets = await io.in(roomId).fetchSockets();
			// return JSON.parse(sockets);
			let socketIds = sockets.map((socket) => socket.id);
			// return JSON.parse(socketIds);
			return socketIds.toString();
		} catch (error) {
			console.error(`Error fetching sockets in room ${roomId}:`, error);
			throw error;
		}
	};

	socket.on("disconnect", function () {
		console.log("user disconnected");
		const user = socket.request.user;
		const classId = gameManager.playerClasses[user.User_Id];
		console.log(classId);
		if (classId) {
			gameManager.deletePlayerFromGame(user.User_Id);
			io.to(classId).emit("playerLeft", { User_Id: user.User_Id });
			if (!gameManager.getGame(classId)) io.to(classId).emit("gameEnded");
		}
	});

	socket.on("isGameActive", (classId) => {
		var game = gameManager.getGame(classId);
		socket.emit("isGameActiveResponse", game !== undefined);
	});

	socket.on("pingToServer", (arg) => {
		const game = gameManager.games[arg];
		socket.emit("pingToClient", {
			classId: game.classId,
			players: game.players,
			questions: game.questions,
		});
	});

	socket.on("connectToRoom", (roomId) => {
		socket.join(roomId);
		io.to(roomId).emit("roomMessage", "A new client has joined!");
	});

	socket.on("fetchSocketsInRoom", (roomId) => {
		fetchSocketsInRoom(roomId).then((sockets) =>
			socket.emit("allSocketsInRoom", JSON.stringify(sockets))
		);
	});

	socket.on("joinGame", (classId) => {
		const user = socket.request.user;
		gameManager.addPlayerToGame(socket.request.user, classId);
		const player = gameManager.getPlayer(user.User_Id);
		io.to(classId).emit("playerJoined", player);
	});

	// startGameRequest => { classId, sets }
	socket.on("createLobby", (startGameRequest) => {
		const classId = startGameRequest.classId;
		const sets = startGameRequest.sets;
		const user = socket.request.user;
		var gameCreated = gameManager.createGame(classId, sets, 30);
		if (!gameCreated) return;
		gameManager.addPlayerToGame(user, classId);
		const player = gameManager.getPlayer(user.User_Id);
		io.to(classId).emit("lobbyCreated");
		io.to(classId).emit("playerJoined", player);
	});

	socket.on("getGameData", (classId) => {
		const game = gameManager.getGame(classId);
		if (!game) return;
		const playersDictionary = gameManager.getPlayers(classId);
		const players = Object.values(playersDictionary);
		const currentQuestion = game.getCurrentQuestion();
		const gameData = { players: players, currentQuestion: currentQuestion };
		socket.emit("receiveGameData", gameData);
	});

	socket.on("startGame", (classId) => {
		const game = gameManager.getGame(classId);
		if (!game || game.hasStarted()) return;
		gameManager.startGame(classId);
		io.to(classId).emit("gameStarted");
		io.to(classId).emit("newQuestionStarted", game.getCurrentQuestion());
	});

	socket.on("processAnswer", (answer) => {
		const user = socket.request.user;
		const game = gameManager.getGameFromUser(user.User_Id);
		if (!game || !game.hasStarted()) return;
		gameManager.processAnswer(user.User_Id, answer);
	});
};
