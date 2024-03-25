import React from "react";

export default function Lobby({ players }) {
	console.log(players);
	return (
		<div className="mt-3">
			Lobby
			<ul>
				{players.map((player) => (
					<li key={`lobby-${player.User_Id}`}>{player.First_Name}</li>
				))}
			</ul>
		</div>
	);
}
