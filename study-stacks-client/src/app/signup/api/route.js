import { cookies } from "next/headers";
const apiUrl = "http://localhost:8080/";

const generateResponse = (message) => {
	return JSON.stringify({ message: message });
};

export async function POST(request) {
	const body = await request.json();
	const credentials = JSON.stringify(body);

	const res = await fetch(`${apiUrl}api/auth/signup`, {
		method: "POST",
		// mode: "cors", // no-cors, *cors, same-origin
		headers: {
			"Content-Type": "application/json",
		},
		body: credentials,
	});
	const resJson = await res.json();

	if (!res.ok) {
		const response = { message: resJson.message };
		return new Response(JSON.stringify(response), {
			status: 404,
		});
	}

	const setCookie = res.headers.get("set-cookie");
	console.log(setCookie);
	return new Response(generateResponse("successfully signed up"), {
		status: 200,
		headers: { "Set-Cookie": `${setCookie}` },
	});
}
