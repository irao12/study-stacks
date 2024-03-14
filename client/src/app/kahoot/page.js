import Kahoot from "./components/Kahoot";
import { socketClient } from "../sockets";

export default function Index() {
	return (
		<main id="kahoot-page">
			<div
				className={`w-100 d-flex justify-content-center align-items-center`}
			>
				<Kahoot />
			</div>
		</main>
	);
}
