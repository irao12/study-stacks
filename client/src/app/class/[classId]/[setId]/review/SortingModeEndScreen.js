import React, { useEffect } from "react";
import { useReward } from "react-rewards";
import Link from "next/link";

export default function SortingModeEndScreen({
	styles,
	set,
	classId,
	setId,
	restartFlashcards,
}) {
	const { reward, isAnimating } = useReward("rewardId", "confetti");

	useEffect(() => {
		reward();
		console.log("hi");
	}, []);

	return (
		<div
			id="rewardId"
			className="d-flex flex-column justify-content-center align-items-center h-100 p-3"
		>
			<div
				className={`${styles.endScreenCard} card d-flex flex-column justify-content-center align-items-center gap-3 p-3`}
			>
				<h2 className={`${styles.endScreenText} text-center`}>
					You've learned everything!
				</h2>

				<h4 className="text-center">
					<span className={`${styles.endScreenNumTerms}`}>
						{set.Terms.length}/{set.Terms.length}
					</span>
					<span> terms learned</span>
				</h4>
				<div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mt-2">
					<button
						className="btn btn-primary fs-5 text-center col-md-6 col-12"
						onClick={restartFlashcards}
					>
						Restart flashcards
					</button>
					<Link
						className="btn btn-secondary fs-5 text-center col-md-6 col-12"
						href={`/class/${classId}/${setId}`}
					>
						Back to set page
					</Link>
				</div>
			</div>
		</div>
	);
}
