import React from "react";
import { headers } from "next/headers";
import ClassSets from "./components/ClassSets";
const apiUrl = process.env.API_URL;

export default function Index({ params }) {
	const headersList = headers();
	const user = JSON.parse(headersList.get("user"));
	const classId = params.classId;

	return (
		<main>
			<div className="p-3">
				This is the page for a specifc class. This is class{" "}
				{params.classId}
				<ClassSets classId={classId} />
			</div>
		</main>
	);
}
