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
	mdiCheckCircleOutline,
	mdiCloseCircleOutline,
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

	const [inSortingMode, setInSortingMode] = useState(false);
	const [reviewTerms, setReviewTerms] = useState([]);
	const [numLearning, setNumLearning] = useState(0); //get rid 
	const [numKnown, setNumKnown] = useState(0);

	useEffect(() => {
		const unshuffledArrayPart = set.Terms.slice(0, index)
		const shuffledArrayPart = shuffle(set.Terms.slice(index))
		setTerms(isShuffled ? unshuffledArrayPart.concat(shuffledArrayPart) : set.Terms);
	}, [isShuffled])
	
	// FIX not showing right length
	// also shuffle not working anymore
	// also missing one card when u want to still learn it
	// also want to restart flashcards maybe if put in sorting mode
	// when restart flashcards and shuffled -> shuffle button still green/on even tho unshuffled
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
		setNumLearning(0);
		setNumKnown(0);
		setTerms(set.Terms);
	};

	// const saveCardToReview = () => {
	// 	setReviewTerms([...reviewTerms, terms[index]]);
	// 	toNextCardSortingMode(true);
	// }

	const toNextCardSortingMode = (pressedX) => {
		const newReviewTerms = [...reviewTerms, terms[index]];
		if (pressedX) // always want to save if pressed x
			setReviewTerms(newReviewTerms);

		if (index === numTerms - 1)
		{
			// restart flashcards
			setIndex(0);
			setNumLearning(0);
			setNumKnown(0);
			setTerms(newReviewTerms); // this is different
			setReviewTerms([]);
		}
		else
		{
			if (pressedX)
				setNumLearning(numLearning + 1);
			else
				setNumKnown(numKnown + 1);
			toNextCard();
		}
	}

	return (
		<div className={inSortingMode && index == numTerms ? `d-none` : `review-page-container h-100 p-3`}>
			<button className="btn btn-primary" type="button">
				<Link href={`/class/${classId}/${setId}`}>Back</Link>
			</button>
			<div className="review-container mt-3 gap-3 d-flex flex-column align-items-center">
				<h3 className="m-0">{set.Name} </h3>

				<div className={`${styles.termNumbers} d-flex justify-content-between`}>
					<p className={`${styles.learningTerms}`}>
						{inSortingMode ? 'Learning: ' + numLearning : ''}
					</p>
					<p className="text-center">
						{index + 1}/{numTerms}
					</p>
					<p className={`${styles.knownTerms} text-end`}>
						{inSortingMode ? 'Known: ' + numKnown : ''}
					</p>
				</div>

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
											<div className="form-check form-switch">
												<input className={`${styles.switchButton} form-check-input`} onClick={() => {setInSortingMode(!inSortingMode)}} type="checkbox"/>
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
								index === 0 && !inSortingMode ? "disabled" : ""
							} p-0`}
							onClick={inSortingMode ? () => { toNextCardSortingMode(true) } : toPrevCard}
						>
							<Icon
								path={inSortingMode ? mdiCloseCircleOutline : mdiArrowLeftCircleOutline}
								size={2}
								color={inSortingMode ? `var(--medium-light-red)` : `var(--light-blue-green)`}
							/>
						</button>
						<button
							className={`btn ${
								index === numTerms - 1 && !inSortingMode ? "disabled" : ""
							} p-0`}
							onClick={inSortingMode ? () => { toNextCardSortingMode(false); } : toNextCard}
						>
							<Icon
								path={inSortingMode ? mdiCheckCircleOutline : mdiArrowRightCircleOutline}
								size={2}
								color={inSortingMode ? `var(--green)` : `var(--light-blue-green)`}
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
