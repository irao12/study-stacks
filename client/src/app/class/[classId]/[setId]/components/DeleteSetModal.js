"use client";

import { useRouter } from "next/navigation";
import React, { useRef } from "react";

export default function DeleteSetModal({ set }) {
	const router = useRouter();
	const closeButtonRef = useRef();

	const deleteSet = async (e) => {
		const res = await fetch(
			`/api/set/${set.Class.Class_Id}/${set.Set_Id}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!res.ok) {
			setErrorMessage("Failure to delete class");
		}
		if (res.ok) {
			router.push(`/class/${set.Class.Class_Id}`);
			closeButtonRef.current.click();
		}
	};

	return (
		<div className="modal modal-md" id="delete-set-modal">
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Delete Set</h5>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
							ref={closeButtonRef}
						></button>
					</div>
					<div className="modal-body p-3">
						<div className={`main-button-div`}>
							<h5>
								Are you sure you want to delete this set with
								all its terms and flashcards?
							</h5>
							<button
								className="btn btn-danger mt-3 w-100"
								onClick={deleteSet}
							>
								Confirm Delete
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
