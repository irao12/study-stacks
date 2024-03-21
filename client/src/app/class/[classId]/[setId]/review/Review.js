"use client"

import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./review.module.css";
import Icon from "@mdi/react";
import { mdiDotsHorizontal, mdiArrowLeftCircleOutline, mdiArrowRightCircleOutline, mdiShuffle } from "@mdi/js";

// example of a set
// {
//   Set_Id: 1,
//   Name: 'Biology',
//   Class_Id: 0,
//   Terms: [ { Term_Id: 1, Content: 'Test', Set_Id: 1, Flashcards: [] } ]
// }

export default function Review({ set, setId, classId }) {
	const [index, setIndex] = useState(0);
	const [isShowingFront, setIsShowingFront] = useState(true);
	const numTerms = set.Terms.length;

	const currentTerm = set.Terms[index];
	const currentDef = currentTerm.Flashcards[0];

	const frontSide = currentTerm.Content;
	const backSide = currentDef.Content;

	const flipCard = () => {
		// setIsShowingFront((prevIsShowingFront) => {
		// 	setIsShowingFront(!prevIsShowingFront)
		// })
		setIsShowingFront(!isShowingFront);
	}

	const toNextCard = () => {
		setIndex(index + 1);
		setIsShowingFront(true);
	}

	const toPrevCard = () => {
		setIndex(index - 1);
		setIsShowingFront(true);
	}
	
	return (
		<div className="review-page-container h-100 p-3">
			<button className="btn btn-primary" type="button">
				<Link href={`/class/${classId}/${setId}`}>Back</Link>
			</button>
			<div className="review-container mt-3 gap-3 d-flex flex-column align-items-center">
				<h3 className="m-0">{set.Name} </h3>
				<p className="">{index + 1}/{numTerms}</p>

				<div className={`${styles.card} card p-3 justify-content-center align-items-center`} onClick={flipCard}>
					{isShowingFront ? frontSide : backSide}

					{/* {set.Terms.map((term) => (
						<p className="m-0" key={`term-${term.Term_Id}`}>{term.Content}</p>
					))} */}
				</div>

				<div className={`${styles.reviewButtons} d-flex justify-content-between`}>
					<button>
						<Icon path={mdiDotsHorizontal} size={1.75}/>
					</button>

					<div className="">
						<button className={`btn ${index === 0 ? 'disabled' : ''} p-0`} onClick={toPrevCard}>
							<Icon path={mdiArrowLeftCircleOutline} size={2} color={`var(--light-blue-green)`}/>
						</button>
						<button className={`btn ${index === numTerms - 1 ? 'disabled' : ''} p-0`} onClick={toNextCard}>
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
