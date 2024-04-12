import React from "react";
import Icon from "@mdi/react";
import { mdiMedal, mdiTrophy, mdiTrophyVariant } from "@mdi/js";

export default function GameResults({ results }) {
	return (
		<div className="game-results mt-3">
			<div className="card p-4">
				<h3 className="m-0">Results</h3>
				<div className="d-flex flex-column gap-2 mt-4">
					{results.map((player, index) => {
						let color;
						let headingSize;
						switch (index) {
							case 0:
								headingSize = "h4";
								color = "#ffbf00";
								break;
							case 1:
								headingSize = "h5";
								color = "#A7A7A7";
								break;
							case 2:
								headingSize = "h5";
								color = "#cd7f32";
								break;
							default:
								headingSize = "h5";
						}
						return (
							<div
								className="d-flex flex-row rounded align-items-center mt-0 gap-2"
								key={`game-result-player-${player.User_Id}`}
							>
								{index <= 2 && (
									<div
										className={`p-2 rounded-circle d-flex justify-content-center align-items-center`}
									>
										<Icon
											path={
												index === 0
													? mdiTrophyVariant
													: mdiMedal
											}
											size={1.5}
											color={color}
										></Icon>
									</div>
								)}
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
