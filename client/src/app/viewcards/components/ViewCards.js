"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ViewCards() {
	const router = useRouter();

	const [errorMessage, setErrorMessage] = useState("");
	const [displayedCards, setDisplayedCards] = useState([]);
	const [editData, setEditData] = useState([]);
	const [promptData, setPromptData] = useState("");
	const [contentData, setContentData] = useState("");
	
	const displayCards = async (e) => {
		const res = await fetch("/api/cards/viewallcards", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const cards = await res.json()
		if (!res.ok) {
			setErrorMessage("Failure to view cards");
		}
		if (res.ok) {
			setDisplayedCards(cards);
			for (let card of cards) {
				let newArray = [null, null];
				setEditData(editData => [...editData, newArray]);
			}
		}
	};

	useEffect(() => {
		displayCards();
	}, []);

	const deleteCard = async (cardId) => {
		const res = await fetch("/api/cards/deletecards", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({id: cardId})
		});

		const cards = await res.json()
		if (!res.ok) {
			setErrorMessage("Failure to view cards");
		}
		if (res.ok) {
			// console.log(res);
			displayCards();
		}
	};

	const handleChange = (index, secondIndex, e) => {
		// Create a new array with the updated value
		const { value } = e.target;
		let newArray = editData[index];
		newArray[secondIndex] = value;
		setEditData(
			editData.map((row, rowIndex) => {
				if (rowIndex == index) {
					return newArray;
				}
				return row;
			})
		)
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
				Prompt: editData[index][0],
				Content: editData[index][1],
				id: id,
			}),
		});
		if (!res.ok) {
			const resJson = await res.json();
			setErrorMessage(resJson.message);
		}
		if (res.ok) {
			displayCards();
		}
    };


	return (
		<div className={`w-100 card p-5`}>
			<h3 className="mb-2 pb-2 mb-3 border-bottom">View Cards</h3>
			{errorMessage !== "" && (
				<div className="alert alert-danger">{errorMessage}</div>
			)}
			{
				displayedCards.length > 0 ? (
					displayedCards.map((card, index) => 
						<div className="card my-4" key={index}>
							<button type="button" className="btn-close" aria-label="Close" onClick={() => deleteCard(card["id"])}></button>
							<div className="card-body">
								<h5 className="card-title">{card["Prompt"]}</h5>
								<div className="card-text">{card["Content"]}</div>
								<form onSubmit={(e) => handleSubmit(e, index, card["id"])}>
									<label htmlFor="Prompt">New Prompt:</label><br />
									<input
										type="text"
										id="Prompt"
										name="Prompt"
										onChange={(e) => handleChange(index, 0, e)}
									/><br />

									<label htmlFor="Contemt">New Content:</label><br />
									<input
										type="text"
										id="Content"
										name="Content"
										onChange={(e) => handleChange(index, 1, e)}
									/><br /><br />

									<input type="submit" value="Submit" />
								</form>
							</div>
						</div>)
				) : (
					<div> No cards to display </div>
				)
			}
		</div>
	);
}
