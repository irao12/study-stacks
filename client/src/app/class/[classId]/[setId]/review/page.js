import React from "react";
import Review from "./Review";
import Link from "next/link";

export default async function Index({ params }) {
	const classId = params.classId;
	const setId = params.setId;

	return (
		<main>
			<Link
				className="btn btn-primary mt-3 ms-3"
				href={`/class/${classId}/${setId}`}
			>
				Back
			</Link>
			<Review setId={setId} classId={classId} />
		</main>
	);
}
