const { io } = require("socket.io-client");

export default function socketClient() {
	const socket = io(process.env.API_URL, {
		transports: ["websocket"],
		autoConnect: false,
	});

	return socket;
}
