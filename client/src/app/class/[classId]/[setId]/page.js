import React from "react";
import { headers } from "next/headers";
import SetPage from "./components/SetPage";
const apiUrl = process.env.API_URL;

export default function Index({ params }) {
	const headersList = headers();
	const user = JSON.parse(headersList.get("user"));
	const setId = params.setId;

	return (
		<main>
			<SetPage setId={setId} />
		</main>
	);
}
