module.exports = (io, socket) => {
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

	});
};
