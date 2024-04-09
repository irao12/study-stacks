import React from "react";
import Review from "./Review";
import Link from "next/link";

export default async function Index({ params }) {
	const classId = params.classId;
	const setId = params.setId;

	return (
		<main>
			<Review setId={setId} classId={classId} />
		</main>
	);
}
