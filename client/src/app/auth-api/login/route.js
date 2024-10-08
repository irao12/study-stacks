import { cookies } from "next/headers";
const apiUrl = process.env.API_URL;

const generateResponse = (message) => {
	return JSON.stringify({ message: message });
};

export async function GET(request) {
	const cookieStore = cookies();
	const sessionIdCookie = cookieStore.get("connect.sid");

	if (!sessionIdCookie)
		return new Response(generateResponse("Not Authenticated"), {
			status: 404,
		});

	const res = await fetch(`${apiUrl}/api/auth/login`, {
		headers: {
			Cookie: `connect.sid=${sessionIdCookie.value};`,
		},
	});

	if (!res.ok) {
		cookieStore.delete("connect.sid");
		cookieStore.delete("token");
		return new Response(generateResponse("Session expired"), {
			status: 404,
		});
	}

	const user = await res.json();

	return new Response(JSON.stringify(user), {
		status: 200,
	});
}

export async function POST(request) {
	const body = await request.json();
	const credentials = JSON.stringify(body);

	const res = await fetch(`${apiUrl}/api/auth/login`, {
		method: "POST",
		// mode: "cors", // no-cors, *cors, same-origin
		headers: {
			"Content-Type": "application/json",
		},
		body: credentials,
	});

	if (!res.ok) {
		const response = { message: "invalid credentials" };
		return new Response(JSON.stringify(response), {
			status: 404,
		});
	}

	const responseBody = await res.json();
	const token = responseBody.token;
	const setCookie = res.headers.get("set-cookie");
	// const token = cookieStore.get("connect-sid");
	return new Response(generateResponse("Successfully authenticated"), {
		status: 200,
		headers: {
			"Set-Cookie": `${setCookie}, token=${token};Path=/; HttpOnly`,
		},
	});
}
