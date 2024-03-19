module.exports = (io, socket) => {
	socket.on("disconnect", function () {
		console.log("user disconnected");
	});

	socket.on("pingToServer", (arg) => {
		socket.emit("pingToClient", arg);
		io.to("room1").emit("pingToClient", `Message for room 1: ${arg}`);
	});
};
