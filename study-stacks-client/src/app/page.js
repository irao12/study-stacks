import { cookies } from "next/headers";

export default async function Index(props) {
	const cookie = cookies();
	const sessionIdCookie = cookie.get("connect.sid");
	let user = null;

	if (sessionIdCookie) {
		const res = await fetch("http://localhost:8080/api/auth/login", {
			method: "GET",
			headers: {
				Cookie: `connect.sid=${sessionIdCookie.value};`,
			},
		});
		if (res.ok) {
			user = await res.json();
		}
	}

	return (
		<main className="p-3">
			{user && <div>Hi {user.firstName}</div>}
			StudyStacks
		</main>
	);
}
