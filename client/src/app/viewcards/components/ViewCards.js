"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ViewCards() {
	const router = useRouter();

	const [errorMessage, setErrorMessage] = useState("");
	const [displayedCards, setDisplayedCards] = useState([]);
	
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

	return (
		<div className={`w-100 card p-5`}>
			<h3 className="mb-2 pb-2 mb-3 border-bottom">View Cards</h3>
			{errorMessage !== "" && (
				<div className="alert alert-danger">{errorMessage}</div>
			)}
			{
				displayedCards.length > 0 ? (
					displayedCards.map((card) => 
						<div className="card my-4" >
							<button type="button" class="btn-close" aria-label="Close" onClick={() => deleteCard(card["id"])}></button>
							<div className="card-body">
								<h5 className="card-title">{card["Prompt"]}</h5>
								<div className="card-text">{card["Content"]}</div>
							</div>
						</div>)
				) : (
					<div> No cards to display </div>
				)
			}
		</div>
	);
}
