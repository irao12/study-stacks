const OpenAI = require("openai");
const openai = new OpenAI({
	apiKey: process.env.OpenAI_API_KEY || "",
});

class Summarizer {
	constructor() {
		this.model = "gpt-3.5-turbo";
	}

	async summarize(strings) {
		let input_string = "";
		for (let string of strings) {
			input_string += `<string>${string}</string>\n`;
		}
		const completion = await openai.chat.completions
			.create({
				messages: [
					{
						role: "system",
						content:
							"Given a series of strings delimited with XML tags on a specific topic, craft a succinct definition without adding extra details.",
					},
					{
						role: "user",
						content: input_string,
					},
				],
				model: this.model,
			})
			.catch((error) => {
				console.log("Failed to get response");
				return error;
			});
		return completion.choices[0]["message"]["content"];
	}
}

module.exports = Summarizer;
