const { io } = require("socket.io-client");

export default function socketClient(cookie) {
	const socket = io(process.env.API_URL, {
		autoConnect: false,
		extraHeaders: {
			Authorization: `bearer ${cookie}`,
		},
	});

	return socket;
}
