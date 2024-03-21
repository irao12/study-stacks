import Kahoot from "./components/Kahoot";
import { socketClient } from "../../sockets";

export default function Index({ params }) {
	const roomId = params.roomId;

	return (
		<main id="kahoot-page">
			<div
				className={`w-100 d-flex justify-content-center align-items-center`}
			>
				<Kahoot roomId={roomId} />
			</div>
		</main>
	);
}
