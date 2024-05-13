import { headers } from "next/headers";
import Image from "next/image";
import studyImage from "../assets/study.png";
import styles from "./page.module.css";
import HomePageCard from "./components/HomePageCard";

export default function Index() {
	const headersList = headers();
	const user = JSON.parse(headersList.get("user"));

	return (
		<main className={`${styles.main} h-100 d-flex flex-column`}>
			<Image
				src={studyImage}
				className={`${styles.hero} img-fluid`}
				alt="study-hero-image"
			/>
			<div className="flex-grow-1 home-text-container d-flex flex-column justify-content-center justify-content-md-around flex-md-row align-items-center p-4 gap-4">
				<div className="home-text d-flex flex-column gap-3 my-2">
					<h3 className={`${styles.slogan} m-0`}>
						{user
							? `Hello ${user.First_Name}!`
							: "A single hub for all your studying needs."}
					</h3>
					<p className={`${styles.text} m-0`}>
						With StudyStacks, you can:
					</p>
					<ul className={`${styles.text} m-0`}>
						<li>Collaborate to create flashcard sets</li>
						<li>
							Test your knowledge with a multiplayer studying game
						</li>
						<li>Work together to create an LLM-generated study guide</li>
					</ul>
					{user && 
						<p className={`${styles.loggedInText} m-0`}>
							Ready to start studying? Here's a motivational quote to inspire you!
						</p>
					}
				</div>
				<HomePageCard user={user}/>
			</div>
		</main>
	);
}
