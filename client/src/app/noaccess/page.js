import { headers } from "next/headers";
import styles from "./page.module.css";
import Link from "next/link";

export default function Index() {
	const headersList = headers();
	const user = JSON.parse(headersList.get("user"));

	return (
		<main className="h-100 d-flex flex-column">
			<div className="h-100 d-flex justify-content-center align-items-center">
				<div className={`card ${styles.noAccessMessage} p-4`}>
					<h4>You do not have access to the page you requested!</h4>
					<Link className="btn btn-primary mt-4" href="/">
						Back to the Home Page
					</Link>
				</div>
			</div>
		</main>
	);
}
