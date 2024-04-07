import React from "react";
import { headers } from "next/headers";
import Review from "./Review";
const apiUrl = process.env.API_URL;

export default async function Index({ params }) {
	const classId = params.classId;
	const setId = params.setId;

	const response = await fetch(`${apiUrl}/api/set/${setId}`, { cache: 'no-store' });
	const set = await response.json();

	const removeNullTerms = (term) => {
		return term.Flashcards.length ? true : false;
	}

	set.Terms = set.Terms.filter(removeNullTerms);

	return (
		<main>
			<Review set={set} setId={setId} classId={classId} />
		</main>
	);
}
