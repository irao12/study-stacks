import React, { useState } from "react";

export default function CreateGameModal({ sets, createLobby }) {
	const includeSetsDictionary = {};
	sets.forEach((set) => {
		includeSetsDictionary[set.Set_Id] = false;
	});

	const [isSetChecked, setIsSetChecked] = useState(includeSetsDictionary);

	const handleCheckboxClicked = (setId) => {
		setIsSetChecked((prevIsSetChecked) => {
			return { ...prevIsSetChecked, [setId]: !prevIsSetChecked[setId] };
		});
	};

	return (
		<div className="modal" id="create-game-modal">
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">
							Choose the sets for the game
						</h5>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div className="modal-body p-3">
						<p>
							Only sets with at least 4 terms with a flashcard are
							valid
						</p>
						{sets.map((set) => (
							<div key={`set-${set.Set_Id}`}>
								<div className="form-check">
									<input
										className="form-check-input"
										type="checkbox"
										onChange={() => {
											handleCheckboxClicked(set.Set_Id);
										}}
										checked={isSetChecked[set.Set_Id]}
										id={`set-${set.Set_Id}-checkbox`}
									/>
									<label
										className="form-check-label"
										htmlFor={`set-${set.Set_Id}`}
									>
										{set.Name}
									</label>
								</div>
							</div>
						))}
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-primary"
							data-bs-dismiss="modal"
							onClick={() => {
								const setsToInclude = sets.filter(
									(set) => isSetChecked[set.Set_Id]
								);
								createLobby(setsToInclude);
							}}
						>
							Start Game
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
