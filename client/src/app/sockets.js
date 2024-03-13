const { io } = require("socket.io-client");

const socket = io(process.env.API_URL);

// client-side
socket.on("connect", () => {
	console.log(socket.id);
});

socket.on("disconnect", () => {
	console.log("Disconnected");
});
