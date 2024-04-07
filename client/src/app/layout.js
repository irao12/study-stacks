import BootstrapClient from "./components/BootstrapClient";
import "../../styles/bootstrap.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { headers } from "next/headers";
import Navbar from "./components/Navbar";
// import localFont from 'next/font/local'
import { alata } from "./fonts";
import "./globals.css";

export const metadata = {
	title: "StudyStacks",
	description: "A study hub",
};

// Font files can be colocated inside of `app`
// const alata = localFont({
// 	src: '../assets/fonts/Alata-Regular.ttf',
// 	display: 'swap',
//   })

export default function RootLayout({ children }) {
	const headersList = headers();
	const user = JSON.parse(headersList.get("user"));
	return (
		<html lang="en">
			<body>
				<div className={`${alata.className} main-div`}>
					<Navbar user={user} />
					{children}
				</div>
			</body>
			<BootstrapClient />
		</html>
	);
}
