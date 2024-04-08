"use client";
import React from "react";
import styles from "./leaderboard.module.css";

export default function Leaderboard({ players, isInBufferPeriod, question }) {
	return (
		<div className="leaderboard">
			<div className="card p-3">
				Leaderboard
				<div className="mt-3 d-flex flex-row gap-3">
					{players.map((player) => (
						<div
							className={`leaderboard-player d-flex flex-column rounded p-3 align-items-center ${
								isInBufferPeriod &&
								(player.answer == question.answerIndex
									? styles.wasCorrect
									: styles.wasIncorrect)
							}`}
							key={`leaderboard-player-${player.User_Id}`}
						>
							<p className="h6">{player.First_Name}</p>
							{player.score}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
