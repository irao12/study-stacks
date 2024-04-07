"use client";

import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";

export default function UpdateSetModal({ set, refresh }) {
	const [errorMessage, setErrorMessage] = useState("");
	const [newSetName, setNewSetName] = useState(set.Name);
	const closeButtonRef = useRef();

	const handleInputChange = (e) => {
		setNewSetName(e.target.value);
	};

	const updateSet = async (e) => {
		e.preventDefault();
		const res = await fetch(`/api/set/${set.Set_Id}`, {
			method: "PUT",
			mode: "cors", // no-cors, *cors, same-origin
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				Name: newSetName,
				Set_Id: set.Set_Id,
			}),
		});
		if (!res.ok) {
			const resJson = await res.json();
			setErrorMessage(resJson.message);
		}
		if (res.ok) {
			closeButtonRef.current.click();
			refresh();
		}
	};

	return (
		<div className="modal modal-xl" id="update-set-modal">
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Update Set</h5>
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
							<form
								className="w-100 m-auto d-flex flex-column"
								onSubmit={updateSet}
							>
								<div className="form-group mb-3">
									<label htmlFor="update-class-input">
										Enter new name
									</label>
									<textarea
										type="text"
										name="name"
										className={`form-control mt-2`}
										id="update-class-input"
										value={newSetName}
										required
										onChange={handleInputChange}
										placeholder="Enter name"
									/>
								</div>
								{errorMessage !== "" && (
									<div className="alert alert-danger">
										{errorMessage}
									</div>
								)}

								<button
									type="submit"
									className="btn btn-primary align-self-end"
								>
									Save
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
