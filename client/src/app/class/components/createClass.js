"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateClass({ refreshClasses }) {
	const [inputs, setInputs] = useState({
		content: "",
	});

	const [errorMessage, setErrorMessage] = useState("");

	const handleInputChange = (e) => {
		setInputs({
			...inputs,
			[e.target.name]: e.target.value,
		});
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		if (inputs.content.trim() === "") setErrorMessage("Class Name: ");
		const res = await fetch("/api/class/createclass", {
			method: "POST",
			mode: "cors", // no-cors, *cors, same-origin
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...inputs }),
		});
		if (!res.ok) {
			const resJson = await res.json();
			setErrorMessage(resJson.message);
		}
		if (res.ok) {
			await refreshClasses();
		}
	};

	return (
		<div className={`main-button-div`}>
			<h5 className="new_class_title">Create New Class</h5>
			<form
				className="w-100 m-auto d-flex flex-column"
				onSubmit={onSubmit}
			>
				<div className="form-group mb-3">
					<textarea
						type="text"
						name="content"
						className={`form-control } mt-2`}
						id="content-input"
						value={inputs.content}
						required
						onChange={handleInputChange}
						placeholder="Enter content"
					/>
				</div>
				{errorMessage !== "" && (
					<div className="alert alert-danger">{errorMessage}</div>
				)}

				<button
					type="submit"
					className="btn btn-primary align-self-end"
				>
					Submit
				</button>
			</form>
		</div>
	);
}
