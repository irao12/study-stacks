import Link from "next/link";
import React from "react";
import styles from "./review.module.css";
import Icon from "@mdi/react";
import { mdiArrowLeftCircleOutline, mdiArrowRightCircleOutline, mdiShuffle } from "@mdi/js";

// example of a set
// {
//   Set_Id: 1,
//   Name: 'Biology',
//   Class_Id: 0,
//   Terms: [ { Term_Id: 1, Content: 'Test', Set_Id: 1, Flashcards: [] } ]
// }

export default function Review({ set, setId, classId }) {
	return (
		<div className="review-page-container h-100 p-3">
			<button className="btn btn-primary" type="button">
				<Link href={`/class/${classId}/${setId}`}>Back</Link>
			</button>
			<div className="review-container mt-3 gap-3 d-flex flex-column align-items-center">
				<h3 className="m-0">{set.Name} </h3>
				<p className="">1/50</p>

				<div className={`${styles.card} card p-3 justify-content-center align-items-center`}>
					{/* only wanna see one card */}

					{set.Terms.map((term) => (
						<p className="m-0" key={`term-${term.Term_Id}`}>{term.Content}</p>
					))}
				</div>

				<div className={`${styles.reviewButtons} d-flex justify-content-between`}>
					<button className={`${styles.optionsButton}`}>Options</button>

					<div className="">
						<button className={`p-0`}>
							<Icon path={mdiArrowLeftCircleOutline} size={2} color={`var(--light-blue-green)`}/>
						</button>
						<button className={`p-0`}>
							<Icon path={mdiArrowRightCircleOutline} size={2} color={`var(--light-blue-green)`}/>
						</button>
					</div>
					
					<button className="">
						<Icon path={mdiShuffle} size={1.75}/>
					</button>
				</div>
			</div>
		</div>
	);
}
