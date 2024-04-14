import React from "react";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import SetPage from "./components/SetPage";
import StudyBattle from "./components/studyBattle/StudyBattle";
import Link from "next/link";
const apiUrl = process.env.API_URL;

export default function Index({ params }) {
	const headersList = headers();
	const user = JSON.parse(headersList.get("user"));
	const setId = params.setId;
	const classId = params.classId;

	const cookieStore = cookies();
	const cookie = cookieStore.get("token")?.value;

	return (
		<main className="p-3">
			{setId === "studybattle" ? (
				<StudyBattle classId={classId} user={user} cookie={cookie} />
			) : (
				<div className="main-div">
					<SetPage
						userId={user.User_Id}
						setId={setId}
						classId={classId}
					/>
				</div>
			)}
		</main>
	);
}
