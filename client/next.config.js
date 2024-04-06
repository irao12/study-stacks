/** @type {import('next').NextConfig} */

const path = require("path");

module.exports = {
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "http://localhost:8080/api/:path*",
			},
		];
	},
	env: {
		API_URL: process.env.API_URL,
	},
	sassOptions: {
		includePaths: [path.join(__dirname, "styles")],
	},
};
