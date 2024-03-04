"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Flashcard from "./Flashcard";

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

	return (
		<div className={`w-100 p-5`}>
			<h3 className="mb-2 pb-2 mb-3 border-bottom">View Cards</h3>
			{errorMessage !== "" && (
				<div className="alert alert-danger">{errorMessage}</div>
			)}
			{
				displayedCards.length > 0 ? (
					displayedCards.map((card) => 
						<Flashcard card={card} displayFunc={displayCards}/>
					)
				) : (
					<div> No cards to display </div>
				)
			}
		</div>
	);
}
