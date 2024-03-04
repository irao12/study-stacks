import { cookies } from "next/headers";
const apiUrl = process.env.API_URL;

export async function POST(request) {
	const cookieStore = cookies();

	if (!cookieStore.has("connect.sid")) {
		const response = { message: "user is not logged in" };
		return new Response(JSON.stringify(response));
	}

	const res = await fetch(`${apiUrl}/api/auth/logout`, {
		method: "POST",
	});

	if (!res.ok) {
		const response = { message: "could not log out" };
		return new Response(JSON.stringify(response), {
			status: 404,
		});
	}

	cookieStore.delete("connect.sid");
	// const token = cookieStore.get("connect-sid");
	return new Response(
		JSON.stringify({ message: "Successfully logged out" }),
		{
			status: 200,
		}
	);
}
