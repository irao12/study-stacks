import React from "react";

export default function GameResults({ results }) {
	return (
		<div className="game-results mt-3">
			<div className="card p-4">
				<h4>Results</h4>
				<div className="d-flex flex-column gap-3">
					{results.map((player, index) => {
						let headingSize;
						switch (index) {
							case 0:
								headingSize = "h4";
								break;
							case 1:
								headingSize = "h5";
								break;
							case 2:
								headingSize = "h6";
								break;
							default:
								headingSize = "p";
						}
						return (
							<div
								className={`d-flex flex-row rounded align-items-center mt-3`}
								key={`game-result-player-${player.User_Id}`}
							>
								<p className={`${headingSize} m-0`}>
									{`${index + 1}. ${player.First_Name} - ${
										player.score
									}`}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
