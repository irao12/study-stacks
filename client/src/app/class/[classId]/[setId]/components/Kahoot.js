"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateGameModal from "./CreateGameModal";
import socketClient from "../../../../sockets";
import Lobby from "./Lobby";

export default function Kahoot({ classId, user }) {
	const router = useRouter();
	const [socket, setSocket] = useState(null);

	const [sets, setSets] = useState(null);
	const [isConnected, setIsConnected] = useState(false);

	const [isGameActive, setIsGameActive] = useState(false);
	const [isUserInGame, setIsUserInGame] = useState(false);
	const [hasGameStarted, setHasGameStarted] = useState(false);

	const [players, setPlayers] = useState([]);

	const fetchSets = async () => {
		const response = await fetch(`/api/set/class/${classId}`);
		const classSets = await response.json();
		const validSets = classSets.filter(
			(set) =>
				set.Terms.length >= 4 &&
				set.Terms.filter((term) => term.Flashcards.length > 0).length ==
					set.Terms.length
		);
		setSets(validSets);
	};

	const joinGame = () => {
		socket.emit("joinGame", classId);
		socket.emit("getOtherPlayers", classId);
	};

	const startGame = (sets) => {
		socket.emit("startGame", { classId: classId, sets: sets });
	};

	const addPlayer = (user) => {
		setPlayers((oldPlayers) => [...oldPlayers, user]);
	};

	const removePlayer = (user) => {
		setPlayers((oldPlayers) => {
			return oldPlayers.filter(
				(player) => player.User_Id != user.User_Id
			);
		});
	};

	useEffect(() => {
		fetchSets();

		function onConnect() {
			console.log("connected");
			setIsConnected(true);
			socket.emit("connectToRoom", classId);
			socket.emit("isGameActive", classId);
		}

		function onDisconnect() {
			setIsConnected(false);
			setIsUserInGame(false);
			setPlayers([]);
			socket.disconnect();
			console.log("disconnected");
		}

		const socket = socketClient();
		setSocket(socket);
		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("pingToClient", (obj) => {
			console.log(obj);
		});

		socket.on("isGameActiveResponse", (isActive) => {
			setIsGameActive(isActive);
		});

		socket.on("allSocketsInRoom", (sockets) => {
			console.log(`Sockets connected to Room ${classId}: ${sockets}`);
		});

		socket.on("playerJoined", (user) => {
			console.log(user);
			if (user.User_Id === user.User_Id) setIsUserInGame(true);
			addPlayer(user);
		});

		socket.on("playerLeft", (user) => {
			console.log("User left: ", user);
			removePlayer(user);
		});

		socket.on("receiveOtherPlayers", (players) => {
			console.log(players);
			setPlayers(players);
		});

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
		};
	}, []);

	const [errorMessage, setErrorMessage] = useState("");

	return (
		<div className={`w-100 p-5`}>
			{sets && <CreateGameModal sets={sets} startGame={startGame} />}
			<div>
				<h3 className="mb-2 pb-2 mb-3 border-bottom">Kahoot</h3>
				<button
					onClick={() => {
						if (socket.connected) return;
						socket.connect();
					}}
				>
					Connect Socket
				</button>
				<button
					onClick={() => {
						if (!socket.connected) return;
						socket.disconnect();
					}}
				>
					Disconnect Socket
				</button>
				<button
					onClick={() => {
						if (!socket.connected) return;
						socket.emit("pingToServer", classId);
					}}
				>
					Testing
				</button>
				<button
					onClick={() => {
						if (!socket.connected) return;
						socket.emit("fetchSocketsInRoom", classId);
					}}
				>
					Fetch All Sockets connected to this room!
				</button>
			</div>

			{sets && isConnected && !isUserInGame && (
				<div className="d-flex justify-content-end">
					{isGameActive ? (
						<button className="btn btn-primary" onClick={joinGame}>
							Join Game
						</button>
					) : (
						<button
							className="btn btn-primary"
							data-bs-toggle="modal"
							data-bs-target="#create-game-modal"
						>
							Create Game
						</button>
					)}
				</div>
			)}

			{isUserInGame && !hasGameStarted && (
				<div>
					<div className="game-div">You are in the game!</div>
					<Lobby players={players} />
				</div>
			)}
		</div>
	);
}
