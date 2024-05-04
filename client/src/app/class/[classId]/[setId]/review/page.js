import React from "react";
import { headers } from "next/headers";
import Review from "./Review";
import Link from "next/link";

export default async function Index({ params }) {
	const classId = params.classId;
	const setId = params.setId;
	
	const headersList = headers();
	const userId = JSON.parse(headersList.get("user")).User_Id;

	return (
		<main>
			<Review setId={setId} classId={classId} userId={userId}/>
		</main>
	);
}
