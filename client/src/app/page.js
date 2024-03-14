import { headers } from "next/headers";
import Image from "next/image";
import studyImage from "../assets/study.png";
import { alata } from "./fonts";
import styles from "./page.module.css";
import Link from "next/link";

export default function Index() {
	const headersList = headers();
	const user = JSON.parse(headersList.get("user"));
	return (
		<main className={`${styles.main} h-100 d-flex flex-column`}>
			<Image
				src={studyImage}
				className="img-fluid"
				alt="study-hero-image"
			/>
			<div className="flex-grow-1 home-text-container d-flex flex-column justify-content-center justify-content-md-around flex-md-row align-items-center px-4 gap-3">
				<div className="home-text d-flex flex-column gap-3 my-2">
					<h3 className={`${styles.slogan} m-0`}>
						A single hub for all your studying needs.
					</h3>
					<p className={`${styles.text} m-0`}>
						With StudyStacks, you can:
					</p>
					<ul className={`${styles.text}`}>
						<li>Collaborate to create flash card sets</li>
						<li>Earn points after reviewing these study sets</li>
						<li>
							Test your knowledge with a multiplayer studying game
						</li>
					</ul>
				</div>
				<div
					className={`${styles.card} card sign-up-card d-flex justify-content-center align-items-center p-3`}
				>
					<Link href="/signup">Sign up today!</Link>
				</div>
				
			</div>
		</main>
	);
}
