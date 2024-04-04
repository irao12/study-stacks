import React from "react";
import { headers } from "next/headers";
import StudyGuide from "./components/StudyGuide";
const apiUrl = process.env.API_URL;

export default function Index({ params }) {
	const headersList = headers();
	const user = JSON.parse(headersList.get("user"));
	const setId = params.setId;
	const classId = params.classId;

	return (
		<main>
			<StudyGuide setId={setId} classId={classId} />
		</main>
	);
}
