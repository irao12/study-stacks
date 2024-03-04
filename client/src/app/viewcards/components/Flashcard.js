"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Flashcard(props) {
	const router = useRouter();

	const [errorMessage, setErrorMessage] = useState("");
	const [promptData, setPromptData] = useState("");
	const [contentData, setContentData] = useState("");
	
	const deleteCard = async (e) => {
		const res = await fetch("/api/cards/deletecards", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({id: props.card["id"]})
		});

		const cards = await res.json()
		if (!res.ok) {
			setErrorMessage("Failure to view cards");
		}
		if (res.ok) {
			console.log(res);
		}
	};

	const handlePromptChange = (e) => {
		const { value } = e.target;
		setPromptData(value);
    };

	const handleContentChange = (e) => {
		const { value } = e.target;
		setContentData(value);
	};

	const handleSubmit = async (e, index, id) => {
        e.preventDefault();
		const res = await fetch("/api/cards/updatecards", {
			method: "POST",
			mode: "cors", // no-cors, *cors, same-origin
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				Prompt: promptData,
				Content: contentData,
				id: props.card["id"],
			}),
		});
		if (!res.ok) {
			const resJson = await res.json();
			setErrorMessage(resJson.message);
		}
		if (res.ok) {
			props.displayFunc();
		}
    };


	return (
		<div className="card my-4">
			<button type="button" className="btn-close" aria-label="Close" onClick={deleteCard}></button>
			<div className="card-body">
				<h5 className="card-title">{props.card["Prompt"]}</h5>
				<div className="card-text">{props.card["Content"]}</div>
				<form onSubmit={handleSubmit}>
					<label htmlFor="Prompt">New Prompt:</label><br />
					<input
						type="text"
						id="Prompt"
						name="Prompt"
						onChange={handlePromptChange}
					/><br />

					<label htmlFor="Content">New Content:</label><br />
					<input
						type="text"
						id="Content"
						name="Content"
						onChange={handleContentChange}
					/><br /><br />

					<input type="submit" value="Submit" />
				</form>
			</div>
		</div>
	);
}
