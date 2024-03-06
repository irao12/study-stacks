import React from "react";
import { headers } from "next/headers";
const apiUrl = process.env.API_URL;

export default function Index({ params }) {
	const headersList = headers();
	const user = JSON.parse(headersList.get("user"));

	return (
		<div>
			ClassId: {params.classId} <br />
			SetId: {params.setId}
		</div>
	);
}
