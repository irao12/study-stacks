"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateGameModal from "./CreateGameModal";
import socketClient from "../../../../../sockets";
import Lobby from "./Lobby";
import Link from "next/link";
import QuestionInterface from "./QuestionInterface";
import Leaderboard from "./Leaderboard";
import GameResults from "./GameResults";
import BackButton from "@/app/components/BackButton";

export default function StudyBattle({ classId, user, token }) {
	const router = useRouter();
	const [socket, setSocket] = useState(null);

	const [sets, setSets] = useState(null);
	const [isConnected, setIsConnected] = useState(false);

	const [error, setError] = useState(null);

	const [isGameActive, setIsGameActive] = useState(false);
	const [isUserInGame, setIsUserInGame] = useState(false);
	const [hasGameStarted, setHasGameStarted] = useState(false);
	const [isInBufferPeriod, setIsInBufferPeriod] = useState(false);
	const [gameResults, setGameResults] = useState(null);
	const [currentQuestion, setCurrentQuestion] = useState(null);

	const [players, setPlayers] = useState([]);
	const [playersAnsweredCount, setPlayersAnsweredCount] = useState(null);
	const [timer, setTimer] = useState(null);
	const [score, setScore] = useState(0);

	const fetchSets = async () => {
		const response = await fetch(`/api/set/class/${classId}`);

		if (response.status === 401) {
			router.push("/noaccess");
			return;
		}

		const classSets = await response.json();
		const validSets = classSets.filter(
			(set) =>
				set.Terms.length >= 4 &&
				set.Terms.filter((term) => term.Flashcards.length > 0).length >=
					4
		);
		validSets.forEach((set) => {
			set.Terms = set.Terms.filter((term) => term.Flashcards.length > 0);
		});
		setSets(validSets);
	};

	const joinGame = () => {
		socket.emit("joinGame", classId);
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

	const sendAnswer = (answer) => {
		socket.emit("processAnswer", answer);
	};

	const resetPlayerAnsweredCount = () => {
		setPlayersAnsweredCount(players.length);
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

		const socket = socketClient(token);
		socket.connect();
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

		socket.on("userAlreadyInGame", () => {
			setError("User is already in an instance of a game");
		});

		socket.on("playerJoined", (joinedUser) => {
			if (user.User_Id === joinedUser.User_Id) {
				setIsUserInGame(true);
				setGameResults(null);
				setError(null);
				socket.emit("getGameData", classId); // expects { players, question }
			}
			addPlayer(joinedUser);
		});

		socket.on("playerLeft", (leftUser) => {
			console.log("User left: ", leftUser);
			removePlayer(leftUser);
		});

		socket.on("gameEnded", (gameResults) => {
			setIsUserInGame(false);
			setIsGameActive(false);
			setHasGameStarted(false);
			setCurrentQuestion(null);
			setIsInBufferPeriod(false);
			setScore(0);
			setTimer(null);
			setPlayers([]);
			if (gameResults) {
				gameResults.sort(
					(player1, player2) => player2.score - player1.score
				);
				setGameResults(gameResults);
			}
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
			setScore(0);
			resetPlayerAnsweredCount();
		});

		socket.on("newQuestionStarted", (question) => {
			console.log(question);
			setCurrentQuestion(question);
		});

		socket.on("timerCount", (secondsPast) => {
			setTimer(secondsPast);
		});

		socket.on("nextRoundStarted", (question) => {
			setCurrentQuestion(question);
			setIsInBufferPeriod(false);

			//clear answers from last round
			setPlayers((oldPlayers) => {
				oldPlayers.forEach((player) => {
					if (player.answer !== null) delete player.answer;
				});
				return oldPlayers;
			});

			resetPlayerAnsweredCount();
		});

		socket.on("bufferPeriodStarted", (players) => {
			players.sort((player1, player2) => player2.score - player1.score);
			setPlayers(players);
			const currentUser = players.filter(
				(player) => player.User_Id === user.User_Id
			)[0];

			setScore(currentUser.score);
			setIsInBufferPeriod(true);
		});

		socket.on("playerAnswered", (playersAnsweredCount) => {
			setPlayersAnsweredCount(playersAnsweredCount);
		});

		return () => {
			socket.disconnect();
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
		};
	}, []);

	const [errorMessage, setErrorMessage] = useState("");

	if (!isConnected) {
		return (
			<div>
				<BackButton url={`/class/${classId}`} />
				<div className="w-100 d-flex justify-content-center">
					<div className="spinner-border" role="status"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-100">
			<BackButton url={`/class/${classId}`} />
			{sets && <CreateGameModal sets={sets} createLobby={createLobby} />}

			<div className="d-flex justify-content-between align-items-center border-bottom">
				<h4 className="mb-2 pb-2 my-3">Study Battle</h4>

				{sets && isConnected && !isUserInGame && (
					<div className="d-flex justify-content-center">
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
			</div>

			{error && <div className="alert alert-danger">{error}</div>}

			{!isUserInGame && !gameResults && (
				<div className="d-flex flex-column text-align-start my-3 gap-3">
					{isGameActive ? <p className="m-0">A game is currently in session!</p> : ""}
					<div className="card d-flex flex-column flex-md-row justify-content-between p-3">
						<div>
							<h5>What is Study Battle?</h5>
							<p className="m-0">Study Battle is a multiplayer game to help you test your knowledge!<br/>
							</p>
						</div>
					</div>

					<div className="card d-flex flex-column flex-md-row justify-content-between p-3">
						<div>
							<h5 className="text-decoration-underline">How to play</h5>
							<p className="m-0 mt-2">
								First, one person creates a game and chooses which sets to use.<br/>
								Then, other users in the same class can join on this page.<br/>
								In each round, match the term to the correct definition. Whoever answers first gets the most points.<br/>
								Get the most points overall to win!<br/>
							</p>
						</div>
					</div>
				</div>	
			)}

			{isUserInGame && !hasGameStarted && (
				<div className="d-flex flex-column py-3 gap-3">
					<div className="game-div">You are in the game!</div>

					<div className="card p-3">
						<p className="mb-1">Studying sets:</p>
						<ul className="m-0">
							{sets.map((set) => (
								<li>{set.Name}</li>
							))}
						</ul>
					</div>
					<div className="card p-3">
						<Lobby players={players} startGame={startGame} />
					</div>
				</div>
			)}

			{isUserInGame && hasGameStarted && currentQuestion && (
				<>
					<div className="d-flex justify-content-between mt-3">
						<h5>Score: {score}</h5>
						{timer !== null && (
							<h5 className={timer > 10 ? "" : "text-danger"}>
								Seconds Left: {timer}
							</h5>
						)}
					</div>

					{isInBufferPeriod && (
						<Leaderboard
							players={players}
							isInBufferPeriod={isInBufferPeriod}
							question={currentQuestion}
						/>
					)}
					<QuestionInterface
						playersAnsweredCount={playersAnsweredCount}
						question={currentQuestion}
						playerCount={players.length}
						sendAnswer={sendAnswer}
						isInBufferPeriod={isInBufferPeriod}
					/>
				</>
			)}

			{!isUserInGame && gameResults && (
				<div className="d-flex flex-column align-items-center">
					{isGameActive ? <h5 className="mt-4 mb-2">A new game is in session!</h5> : ""}
					<GameResults results={gameResults} />
				</div>
			)}
		</div>
	);
}
