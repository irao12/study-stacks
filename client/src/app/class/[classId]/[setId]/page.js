import React from "react";
import { headers } from "next/headers";
import SetPage from "./components/SetPage";
const apiUrl = process.env.API_URL;

export default function Index({ params }) {
	const headersList = headers();
	const user = JSON.parse(headersList.get("user"));
	const setId = params.setId;
	const classId = params.classId;

	return (
		<main>
			<div className="main-div">
				<SetPage
					userId={user.User_Id}
					setId={setId}
					classId={classId}
				/>
			</div>
		</main>
	);
}
