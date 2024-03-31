"use client";
import React from "react";

export default function Leaderboard({ players }) {
	return (
		<div className="leaderboard">
			Leaderboard
			<div className="card flex-row p-3 gap-5 ">
				{players.map((player) => (
					<div
						className="leaderboard-player d-flex flex-column align-items-center"
						key={`leaderboard-player-${player.User_Id}`}
					>
						<p className="h6">{player.First_Name}</p>
						{player.score}
					</div>
				))}
			</div>
		</div>
	);
}
