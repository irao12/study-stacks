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
		}
	});

	socket.on("isGameActive", (classId) => {
		var game = gameManager.getGame(classId);
		socket.emit("isGameActiveResponse", game !== undefined);
	});

	socket.on("pingToServer", (arg) => {
		socket.emit("pingToClient", gameManager.games[arg]);
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
		io.to(classId).emit("playerJoined", {
			User_Id: user.User_Id,
			First_Name: user.First_Name,
		});
	});

	socket.on("startTimer", (classId) => {
		let game = gameManager.getGame(classId);
		game.initializeTimer();
	});

	// startGameRequest => { classId, sets }
	socket.on("startGame", (startGameRequest) => {
		const classId = startGameRequest.classId;
		const sets = startGameRequest.sets;
		const user = socket.request.user;
		var gameCreated = gameManager.createGame(classId, sets);
		if (!gameCreated) return;
		gameManager.addPlayerToGame(user, classId);
		io.to(classId).emit("playerJoined", {
			User_Id: user.User_Id,
			First_Name: user.First_Name,
		});
	});
};
