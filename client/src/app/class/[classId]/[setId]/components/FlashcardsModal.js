import React from "react";

export default function Flashcards({ flashcards }) {
	return (
		<div className="modal" id="flashcards-modal">
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Existing Flashcards</h5>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div className="modal-body p-3">
						{flashcards.map((flashcard) => (
							<div
								key={`set-${flashcard.Flashcard_Id}`}
								className="existing-flashcard"
							>
								<div className="card p-5">
									{flashcard.Content}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
