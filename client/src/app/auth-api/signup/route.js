const apiUrl = process.env.API_URL;

const generateResponse = (message) => {
	return JSON.stringify({ message: message });
};

export async function POST(request) {
	const body = await request.json();
	const credentials = JSON.stringify(body);

	const res = await fetch(`${apiUrl}/api/auth/signup`, {
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

	const token = resJson.token;

	const setCookie = res.headers.get("set-cookie");
	return new Response(generateResponse("successfully signed up"), {
		status: 200,
		headers: {
			"Set-Cookie": `${setCookie}, token=${token};Path=/; HttpOnly`,
		},
	});
}
