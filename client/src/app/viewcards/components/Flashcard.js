"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Flashcard(props) {
	const router = useRouter();

	const [errorMessage, setErrorMessage] = useState("");
	const [currentContentData, setCurrentContentData] = useState("");
	const [contentData, setContentData] = useState("");

	const deleteCard = async (e) => {
		const res = await fetch("/api/cards/deletecard", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ Flashcard_Id: props.card["Flashcard_Id"] }),
		});

		const cards = await res.json();
		if (!res.ok) {
			setErrorMessage("Failure to view cards");
		}
		if (res.ok) {
			await props.onDelete();
		}
	};

	const handleContentChange = (e) => {
		const { value } = e.target;
		setContentData(value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch("/api/cards/updatecard", {
			method: "POST",
			mode: "cors", // no-cors, *cors, same-origin
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				Content: contentData,
				Flashcard_Id: props.card["Flashcard_Id"],
			}),
		});
		if (!res.ok) {
			const resJson = await res.json();
			setErrorMessage(resJson.message);
		}
		if (res.ok) {
			setCurrentContentData(contentData);
		}
	};

	useEffect(() => {
		setCurrentContentData(props.card["Content"]);
	}, []);

	return (
		<div className="w-100 card">
			<button
				type="button"
				className="btn-close"
				aria-label="Close"
				onClick={deleteCard}
			></button>
			<div className="card-body">
				<h5 className="card-title">{currentContentData}</h5>
				<div className="card-text">{currentContentData}</div>
				<form onSubmit={handleSubmit}>
					<label htmlFor="Content">New Content:</label>
					<br />
					<input
						type="text"
						id="Content"
						name="Content"
						onChange={handleContentChange}
					/>
					<br />
					<br />

					<input type="submit" value="Submit" />
				</form>
			</div>
		</div>
	);
}
