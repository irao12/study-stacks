import React from "react";
import { headers } from "next/headers";
import SetPage from "./components/SetPage";
import StudyBattle from "./components/StudyBattle";
import Link from "next/link";
const apiUrl = process.env.API_URL;

export default function Index({ params }) {
	const headersList = headers();
	const user = JSON.parse(headersList.get("user"));
	const setId = params.setId;
	const classId = params.classId;

	return (
		<main className="p-3">
			<div>
				<Link className="btn btn-primary" href={`/class/${classId}`}>
					Back
				</Link>
			</div>
			{setId === "studybattle" ? (
				<StudyBattle classId={classId} user={user} />
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
