import React, { useRef, useState } from "react";

export default function CreateGameModal({ sets, createLobby }) {
	const includeSetsDictionary = {};
	sets.forEach((set) => {
		includeSetsDictionary[set.Set_Id] = false;
	});

	const [isSetChecked, setIsSetChecked] = useState(includeSetsDictionary);

	const closeModalRef = useRef();

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
							ref={closeModalRef}
						></button>
					</div>
					<div className="modal-body p-3">
						<p>
							Only sets that have at least 4 terms with a definition are
							valid.
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
						{sets.length === 0 && (
							<h6>
								There are currently no valid sets.
							</h6>
						)}
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-primary"
							onClick={(e) => {
								const setsToInclude = sets.filter(
									(set) => isSetChecked[set.Set_Id]
								);
								if (setsToInclude.length === 0) return;
								closeModalRef.current.click();
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
