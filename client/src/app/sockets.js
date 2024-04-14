const { io } = require("socket.io-client");

export default function socketClient(token) {
	const socket = io(process.env.API_URL, {
		autoConnect: false,
		extraHeaders: {
			Authorization: `bearer ${token}`,
		},
	});

	return socket;
}
