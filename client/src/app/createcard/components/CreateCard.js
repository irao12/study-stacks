"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./createCard.module.css";

export default function CreateCard({ termId, refresh, classId }) {
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
		const res = await fetch(`/api/flashcard/createcard`, {
			method: "POST",
			mode: "cors", // no-cors, *cors, same-origin
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...inputs,
				termId: termId,
				Class_Id: classId,
			}),
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
		<div className={`w-100 py-3`}>
			<h5 className="mb-2 pb-2 mb-3 border-bottom">Create Flash Card</h5>
			<form
				className="w-100 m-auto d-flex flex-column"
				onSubmit={onSubmit}
			>
				<div className="form-group mb-3">
					<label htmlFor="content-input">Content:</label>
					<textarea
						type="text"
						name="content"
						className={`form-control ${styles.createCard} mt-2`}
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
					Save card
				</button>
			</form>
		</div>
	);
}
