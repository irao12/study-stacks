"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./review.module.css";
import Icon from "@mdi/react";
import {
	mdiDotsHorizontal,
	mdiArrowLeftCircleOutline,
	mdiArrowRightCircleOutline,
	mdiShuffle,
} from "@mdi/js";

// example of a set
// {
//   Set_Id: 1,
//   Name: 'Biology',
//   Class_Id: 0,
//   Terms: [ { Term_Id: 1, Content: 'Test', Set_Id: 1, Flashcards: [] } ]
// }

const shuffle = (array) => {
	const copy = [...array];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export default function Review({ set, setId, classId }) {
	const [index, setIndex] = useState(0);
	const [isShowingFront, setIsShowingFront] = useState(true);
	const [isShuffled, setIsShuffled] = useState(false);
	const [terms, setTerms] = useState(set.Terms);
	const [frontShowingTerms, setFrontShowingTerms] = useState(true);

	useEffect(() => {
		const unshuffledArrayPart = set.Terms.slice(0, index)
		const shuffledArrayPart = shuffle(set.Terms.slice(index))
		setTerms(isShuffled ? unshuffledArrayPart.concat(shuffledArrayPart) : set.Terms);
	}, [isShuffled])
	
	const numTerms = terms.length;

	const currentTerm = terms[index];
	const currentDef = currentTerm.Flashcards[0];

	const frontSide = frontShowingTerms ? currentTerm.Content : currentDef.Content;
	const backSide = frontShowingTerms ? currentDef.Content : currentTerm.Content;

	const flipCard = () => {
		// setIsShowingFront((prevIsShowingFront) => {
		// 	setIsShowingFront(!prevIsShowingFront)
		// })
		setIsShowingFront(!isShowingFront);
	};

	const toNextCard = () => {
		setIndex(index + 1);
		setIsShowingFront(true);
	};

	const toPrevCard = () => {
		setIndex(index - 1);
		setIsShowingFront(true);
	};

	const toggleShuffle = () => {
		setIsShuffled(!isShuffled);
	};

	const restartFlashcards = () => {
		setIndex(0);
	};

	return (
		<div className="review-page-container h-100 p-3">
			<button className="btn btn-primary" type="button">
				<Link href={`/class/${classId}/${setId}`}>Back</Link>
			</button>
			<div className="review-container mt-3 gap-3 d-flex flex-column align-items-center">
				<h3 className="m-0">{set.Name} </h3>
				<p className="">
					{index + 1}/{numTerms}
				</p>

				<div
					className={`${styles.card} card p-3 justify-content-center align-items-center p-4`}
					onClick={flipCard}
				>
					
					{isShowingFront ? frontSide : backSide}

					{/* {set.Terms.map((term) => (
						<p className="m-0" key={`term-${term.Term_Id}`}>{term.Content}</p>
					))} */}
				</div>

				<div
					className={`${styles.reviewButtons} d-flex justify-content-between`}
				>
					<button type="button" data-bs-toggle="modal" data-bs-target="#optionsModal">
						<Icon path={mdiDotsHorizontal} size={1.75} />
					</button>

					<div className="modal fade" id="optionsModal" tabindex="-1" aria-labelledby="optionsModalLabel" aria-hidden="true">
						<div className="modal-dialog modal-dialog-centered">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title" id="optionsModalLabel">Options</h5>
									<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div className={`${styles.modalBody} modal-body d-flex flex-column gap-3 p-4`}>
									<div className="d-flex justify-content-between align-items-center">
										<p className="m-0">Answer with</p>
										<div className="dropdown">
											<button className={`${styles.dropdownToggle} btn dropdown-toggle`} type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
												{frontShowingTerms ? 'Term' : 'Definition'}
											</button>
											<ul className={`${styles.dropdownMenu} dropdown-menu`} aria-labelledby="dropdownMenuButton">
												<li><button className="dropdown-item" onClick={() => {setFrontShowingTerms(true)}}>Term</button></li>
												<li><button className="dropdown-item" onClick={() => {setFrontShowingTerms(false)}}>Definition</button></li>
											</ul>
										</div>
									</div>
									<div>
										<div className="d-flex justify-content-between">
											<p>Sorting mode</p>
											<div class="form-check form-switch">
												<input class={`${styles.switchButton} form-check-input`} type="checkbox"/>
											</div>
										</div>
										<p className={`${styles.smallText}`}>Turn this on to focus on terms you need to review more.</p>
									</div>
									
									<button className={`${styles.restartCardsButton} m-auto mt-2 mb-2`} onClick={restartFlashcards} data-bs-dismiss="modal">Restart flashcards</button>
								</div>
							</div>
						</div>
					</div>

					<div className="">
						<button
							className={`btn ${
								index === 0 ? "disabled" : ""
							} p-0`}
							onClick={toPrevCard}
						>
							<Icon
								path={mdiArrowLeftCircleOutline}
								size={2}
								color={`var(--light-blue-green)`}
							/>
						</button>
						<button
							className={`btn ${
								index === numTerms - 1 ? "disabled" : ""
							} p-0`}
							onClick={toNextCard}
						>
							<Icon
								path={mdiArrowRightCircleOutline}
								size={2}
								color={`var(--light-blue-green)`}
							/>
						</button>
					</div>

					<button className="" onClick={toggleShuffle}>
						<Icon path={mdiShuffle} size={1.75} color={isShuffled ? `var(--light-blue-green)` : `black`}/>
					</button>
				</div>
			</div>
		</div>
	);
}
