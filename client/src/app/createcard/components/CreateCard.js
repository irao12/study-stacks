"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCard({ termId, refresh }) {
	const router = useRouter();
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
		if (inputs.content.trim() === "")
			setErrorMessage("Please enter content!");
		const res = await fetch(`/api/cards/createcard`, {
			method: "POST",
			mode: "cors", // no-cors, *cors, same-origin
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...inputs, termId: termId }),
		});
		if (!res.ok) {
			const resJson = await res.json();
			setErrorMessage(resJson.message);
		}
		if (res.ok) {
			await refresh();
		}
	};

	return (
		<div className={`w-100 card p-5`}>
			<h5 className="mb-2 pb-2 mb-3 border-bottom">Create Card</h5>
			<form className="w-100 m-auto" onSubmit={onSubmit}>
				<div className="form-group mb-3">
					<label htmlFor="content-input">Content:</label>
					<input
						type="text"
						name="content"
						className="form-control"
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

				<button type="submit" className="btn btn-primary">
					Create card
				</button>
			</form>
		</div>
	);
}
