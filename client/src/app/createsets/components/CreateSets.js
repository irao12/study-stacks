"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateSets() {
	const router = useRouter();
	const [inputs, setInputs] = useState({
		prompt: "",
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
		if (
			inputs.prompt.trim() === "" ||
			inputs.content.trim() === ""
		)
			setErrorMessage("Please enter a prompt and content!");
		const res = await fetch("/createsets/api", {
			method: "POST",
			mode: "cors", // no-cors, *cors, same-origin
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(inputs),
		});
		if (!res.ok) {
			const resJson = await res.json();
			setErrorMessage(resJson.message);
		}
		if (res.ok) {
			router.push("/createsets");
		}
	};

	return (
		<div className={`w-100 card p-5`}>
		<h3 className="mb-2 pb-2 mb-3 border-bottom">Create Sets</h3>
		<form className="w-100 m-auto" onSubmit={onSubmit}>
			<div className="form-group mb-3">
				<label htmlFor="prompt-input">Prompt:</label>
				<input
					type="text"
					name="prompt"
					className="form-control"
					id="prompt-input"
					value={inputs.prompt}
					required
					onChange={handleInputChange}
					placeholder="Enter Prompt"
				/>
			</div>
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
				Create Card
			</button>
		</form>
		</div>
	);
}
