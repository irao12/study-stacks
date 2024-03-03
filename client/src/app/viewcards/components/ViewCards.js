"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ViewCards(props) {
	const router = useRouter();

	const [errorMessage, setErrorMessage] = useState("");

	const displayCards = async (e) => {
		const res = await fetch(`/api/cards/viewallcards/`, {
			method: "GET",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!res.ok) {
			setErrorMessage("Failure to view cards");
		}
		if (res.ok) {
			console.log("Succeeded in viewing cards");
		}
	};

	displayCards();

	return (
		<div className={`w-100 card p-5`}>
			<h3 className="mb-2 pb-2 mb-3 border-bottom">View Cards</h3>
			{errorMessage !== "" && (
				<div className="alert alert-danger">{errorMessage}</div>
			)}
		</div>
	);
}
