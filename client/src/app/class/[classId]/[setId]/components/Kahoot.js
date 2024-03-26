"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateGameModal from "./CreateGameModal";
import socketClient from "../../../../sockets";
import Lobby from "./Lobby";
import QuestionInterface from "./QuestionInterface";

export default function Kahoot({ classId, user }) {
	const router = useRouter();
	const [socket, setSocket] = useState(null);

	const [sets, setSets] = useState(null);
	const [isConnected, setIsConnected] = useState(false);

	const [isGameActive, setIsGameActive] = useState(false);
	const [isUserInGame, setIsUserInGame] = useState(false);
	const [hasGameStarted, setHasGameStarted] = useState(false);

	const [currentQuestion, setCurrentQuestion] = useState(null);

	const [players, setPlayers] = useState([]);
	const [timer, setTimer] = useState(null);

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
		socket.emit("getGameData", classId); // expects { players, question }
	};

	const createLobby = (sets) => {
		socket.emit("createLobby", { classId: classId, sets: sets });
	};

	const startGame = () => {
		socket.emit("startGame", classId);
	};

	const addPlayer = (joinedUser) => {
		console.log(joinedUser);
		setPlayers((oldPlayers) => [...oldPlayers, joinedUser]);
	};

	const removePlayer = (leftUser) => {
		setPlayers((oldPlayers) => {
			return oldPlayers.filter(
				(player) => player.User_Id != leftUser.User_Id
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
			setHasGameStarted(false);
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

		socket.on("lobbyCreated", () => {
			setIsGameActive(true);
		});

		socket.on("playerJoined", (joinedUser) => {
			if (user.User_Id === joinedUser.User_Id) setIsUserInGame(true);
			addPlayer(joinedUser);
		});

		socket.on("playerLeft", (leftUser) => {
			console.log("User left: ", leftUser);
			removePlayer(leftUser);
		});

		socket.on("gameEnded", () => {
			setIsUserInGame(false);
			setIsGameActive(false);
			setHasGameStarted(false);
			setCurrentQuestion(null);
		});

		socket.on("receiveGameData", (gameData) => {
			const players = gameData.players;
			const currentQuestion = gameData.currentQuestion;
			setPlayers(players);
			if (currentQuestion) {
				setIsUserInGame(true);
				setHasGameStarted(true);
				setCurrentQuestion(currentQuestion);
			}
		});

		socket.on("gameStarted", () => {
			setHasGameStarted(true);
		});

		socket.on("newQuestionStarted", (question) => {
			console.log(question);
			setCurrentQuestion(question);
		});

		socket.on("timerCount", (secondsPast) => {
			setTimer(secondsPast);
		});

		socket.on("timerCount", (secondsPast) => {
			setTimer(secondsPast);
		});

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
		};
	}, []);

	const [errorMessage, setErrorMessage] = useState("");

	return (
		<div className={`w-100 p-5`}>
			{sets && <CreateGameModal sets={sets} createLobby={createLobby} />}
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
				<button
					onClick={() => {
						if (!socket.connected) return;
						socket.emit("startTimer", classId, 10);
					}}
				>
					Start Timer
				</button>
			</div>

			<div>
				Timer: {timer}
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
					<Lobby players={players} startGame={startGame} />
				</div>
			)}

			{isUserInGame && hasGameStarted && currentQuestion && (
				<QuestionInterface question={currentQuestion} />
			)}
		</div>
	);
}
