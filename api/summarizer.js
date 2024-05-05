const OpenAI = require("openai");
const openai = new OpenAI({
	apiKey: process.env.OpenAI_API_KEY || "",
});

class Summarizer {
	constructor() {
		this.model = "gpt-3.5-turbo";
	}

	async summarize(strings, term) {
		let input_string = "";
		for (let string of strings) {
			input_string += `<string>${string}</string>\n`;
		}
		try {
			const completion = await openai.chat.completions.create({
				messages: [
					{
						role: "system",
						content: `Given a series of strings delimited with XML tags on a specific topic, craft a succinct definition without adding extra details. Do not use the word ${term} in your response.`,
					},
					{
						role: "user",
						content: input_string,
					},
				],
				model: this.model,
			});
			return completion.choices[0]["message"]["content"];
		} catch (error) {
			console.log("Failed to get response");
			return error;
		}
	}
}

module.exports = Summarizer;
