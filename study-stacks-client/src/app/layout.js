import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import BootstrapClient from "./components/BootstrapClient";

export const metadata = {
	title: "StudyStacks",
	description: "A study hub",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>{children}</body>
			<BootstrapClient />
		</html>
	);
}
