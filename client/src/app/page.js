import { headers } from "next/headers";

export default function Index() {
	const headersList = headers();
	const user = JSON.parse(headersList.get("user"));

	return (
		<main className="p-3">
			{user && <div>Hi {user.First_Name}</div>}
			StudyStacks
		</main>
	);
}
