import React from "react";

export default function Lobby({ players, startGame }) {
	return (
		<div className="mt-3">
			Lobby
			<ul>
				{players.map((player) => (
					<li key={`lobby-${player.User_Id}`}>{player.First_Name}</li>
				))}
			</ul>
			{players.length > 1 && (
				<button className="btn btn-primary" onClick={startGame}>
					Start game
				</button>
			)}
		</div>
	);
}
