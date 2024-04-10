"use client";

import { useRouter } from "next/navigation";
import React, { useRef } from "react";

export default function DeleteClassModal({ classToDelete }) {
	const router = useRouter();
	const closeButtonRef = useRef();

	const deleteClass = async (e) => {
		const res = await fetch("/api/class/deleteclass", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ Class_Id: classToDelete["Class_Id"] }),
		});

		if (!res.ok) {
			setErrorMessage("Failure to delete class");
		}
		if (res.ok) {
			router.push("/class");
			closeButtonRef.current.click();
		}
	};

	return (
		<div className="modal modal-md" id="delete-class-modal">
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Delete Class</h5>
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
							<h6>
								Are you sure you want to delete this class with
								all its sets?
							</h6>
							<button
								className="btn btn-danger mt-3 w-100"
								onClick={deleteClass}
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
