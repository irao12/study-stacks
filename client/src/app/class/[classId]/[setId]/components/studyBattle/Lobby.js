import React from "react";

export default function Lobby({ players, startGame }) {
	return (
		<div>
			In lobby:
			<ul className="m-0">
				{players.map((player) => (
					<li key={`lobby-${player.User_Id}`}>{player.First_Name}</li>
				))}
			</ul>
			{players.length > 1 && (
				<button className="btn btn-primary mt-3" onClick={startGame}>
					Start game
				</button>
			)}
		</div>
	);
}
