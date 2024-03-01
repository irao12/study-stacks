const apiUrl = process.env.API_URL;

const generateResponse = (message) => {
	return JSON.stringify({ message: message });
};

export async function POST(request) {
	const body = await request.json();
	const credentials = JSON.stringify(body);

	const res = await fetch(`${apiUrl}/api/sets/createsets`, {
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
	return new Response(generateResponse("set successfully created"), {
		status: 200,
		headers: { "Set-Cookie": `${setCookie}` },
	});
}
