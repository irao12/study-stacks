"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CreateClass({ refreshClasses }) {
	const [className, setClassName] = useState("");

	const [errorMessage, setErrorMessage] = useState("");

	const closeButtonRef = useRef();

	const handleInputChange = (e) => {
		setClassName(e.target.value);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		if (className.trim() === "") setErrorMessage("Class Name: ");
		const res = await fetch("/api/class/createclass", {
			method: "POST",
			mode: "cors", // no-cors, *cors, same-origin
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name: className }),
		});
		if (!res.ok) {
			const resJson = await res.json();
			setErrorMessage(resJson.message);
		}
		if (res.ok) {
			setClassName("");
			closeButtonRef.current.click();
			await refreshClasses();
		}
	};

	return (
		<div className="modal modal-xl" id="create-class-modal">
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Create Class</h5>
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
							<h5 className="new_class_title">
								Create New Class
							</h5>
							<form
								className="w-100 m-auto d-flex flex-column"
								onSubmit={onSubmit}
							>
								<div className="form-group mb-3">
									<textarea
										type="text"
										name="name"
										className={`form-control mt-2`}
										id="content-input"
										value={className}
										required
										onChange={handleInputChange}
										placeholder="Enter content"
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
									Submit
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
