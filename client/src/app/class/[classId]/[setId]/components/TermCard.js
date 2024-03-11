"use client";
import React from "react";
import CreateCard from "@/app/createcard/components/CreateCard";
import Flashcard from "@/app/viewcards/components/Flashcard";

export default function TermCard({ term, refresh, userId }) {
	const hasCreatedACard = term.Flashcards.some(
		(card) => card.User_Id === userId
	);

	return (
		<div className="mt-3 d-flex gap-5 p-3 border-bottom border-primary">
			<h4 className="w-50">{term.Term}</h4>
			{(term.Flashcards.length === 0 || !hasCreatedACard) && (
				<CreateCard refresh={refresh} termId={term.Term_Id} />
			)}

			{term.Flashcards.length > 0 && hasCreatedACard && (
				<Flashcard onDelete={refresh} card={term.Flashcards[0]} />
			)}
		</div>
	);
}
