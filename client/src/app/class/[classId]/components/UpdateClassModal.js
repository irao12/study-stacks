"use client";

import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";

export default function UpdateClassModal({ classToUpdate }) {
	const [errorMessage, setErrorMessage] = useState("");
	const [newClassName, setNewClassName] = useState(classToUpdate.Name);
	const router = useRouter();
	const closeButtonRef = useRef();

	const handleInputChange = (e) => {
		setNewClassName(e.target.value);
	};

	const updateTile = async (e) => {
		e.preventDefault();
		const res = await fetch("/api/class/updateclass", {
			method: "PUT",
			mode: "cors", // no-cors, *cors, same-origin
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				Name: newClassName,
				Class_Id: classToUpdate["Class_Id"],
			}),
		});
		if (!res.ok) {
			const resJson = await res.json();
			setErrorMessage(resJson.message);
		}
		if (res.ok) {
			closeButtonRef.current.click();
			router.refresh();
		}
	};

	return (
		<div className="modal modal-xl" id="update-class-modal">
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Update Class</h5>
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
								onSubmit={updateTile}
							>
								<div className="form-group mb-3">
									<label htmlFor="update-class-input" />
									<textarea
										type="text"
										name="name"
										className={`form-control mt-2`}
										id="update-class-input"
										value={newClassName}
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
