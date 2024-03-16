"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socketClient from "../../sockets";

export default function Kahoot() {
	const router = useRouter();
	const [isConnected, setIsConnected] = useState(socketClient.connected);
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		function onConnect() {
			setIsConnected(true);
			console.log("connected");
		}

		function onDisconnect() {
			setIsConnected(false);
			console.log("disconnected");
		}

		const socket = socketClient();
		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		setSocket(socket);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
		};
	}, []);

	const [errorMessage, setErrorMessage] = useState("");

	return (
		<div className={`w-100 p-5`}>
			<h3 className="mb-2 pb-2 mb-3 border-bottom">Kahoot</h3>
			<button
				onClick={() => {
					if (socket.connected) return;
					socket.connect();
				}}
			>
				Connect Socket
			</button>
		</div>
	);
}
