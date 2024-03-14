const { io } = require("socket.io-client");

export default function socketClient() {
	const socket = io(process.env.API_URL);

	socket.on("connect", () => {
		console.log("Connected");
	});

	socket.on("disconnect", () => {
		console.log("Disconnected");
	});

	socket.on("connect_error", async (err) => {
		console.log(`connect_error due to ${err.message}`);
		await fetch("/api/socket");
	});

	return socket;
}
