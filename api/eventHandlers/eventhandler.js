module.exports = (io, socket) => {
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
	});

	socket.on("pingToServer", (arg) => {
		socket.emit("pingToClient", arg);
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
};
