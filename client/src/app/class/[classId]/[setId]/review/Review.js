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
import BackButton from "@/app/components/BackButton";
import { useRouter } from "next/navigation";
import FlashcardsModal from "../components/FlashcardsModal";
import SortingModeEndScreen from "./SortingModeEndScreen";
import SortingModeBufferScreen from "./SortingModeBufferScreen";

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
};

export default function Review({ setId, classId, userId }) {
	const [index, setIndex] = useState(0);
	const [isShowingFront, setIsShowingFront] = useState(true);
	const [isShuffled, setIsShuffled] = useState(false);
	const [set, setSet] = useState(null);
	const [terms, setTerms] = useState([]);
	const [frontShowingTerms, setFrontShowingTerms] = useState(true);
	const [hasFlipped, setHasFlipped] = useState(false);
	const [inSortingMode, setInSortingMode] = useState(false);
	const [reviewTerms, setReviewTerms] = useState([]);
	// const [numLearning, setNumLearning] = useState(0); //get rid
	const [numKnown, setNumKnown] = useState(0);
	const [viewBufferScreen, setViewBufferScreen] = useState(false);

	const router = useRouter();

	useEffect(() => {
		const removeNullTerms = (term) => {
			return term.Flashcards.length ? true : false;
		};

		fetch(`/api/set/${classId}/${setId}`).then((response) => {
			if (response.status === 401) {
				router.push("/noaccess");
				return;
			}
			response.json().then((newSet) => {
				console.log(newSet);
				newSet.Terms = newSet.Terms.filter(removeNullTerms);
				setSet(newSet);
				setTerms(newSet.Terms);
			});
		});
	}, []);

	if (!set) {
		return (
			<div className="p-3">
				<BackButton url={`/class/${classId}/${setId}`} />
				<div className="w-100 mt-3 d-flex justify-content-center">
					<div className="spinner-border" role="status"></div>
				</div>
			</div>
		);
	}

	const numTerms = terms.length;

	const restartFlashcards = () => {
		setHasFlipped(false);
		setIndex(0);
		setNumKnown(0);
		setTerms(set.Terms);
		setReviewTerms([]); // handles numLearning
		setIsShuffled(false);
		setViewBufferScreen(false); // necessary to restart flashcards from buffer screen
	};

	if (viewBufferScreen) {
		return (
			// buffer screen
			<SortingModeBufferScreen
				styles={styles}
				set={set}
				terms={terms}
				setViewBufferScreen={setViewBufferScreen}
				restartFlashcards={restartFlashcards}
			/>
		);
	} else if (inSortingMode && numTerms === 0) {
		// terms set to [] means learned all terms in sorting mode
		return (
			// end screen
			<SortingModeEndScreen
				styles={styles}
				set={set}
				setId={setId}
				classId={classId}
				restartFlashcards={restartFlashcards}
			/>
		);
	} else if (numTerms === 0) {
		// result from filtering: 0 terms, or none of the terms have definitions
		return (
			<div className="d-flex flex-column justify-content-center align-items-center h-100 p-3 gap-3">
				<h3 className="m-0">No flashcards to review.</h3>
				<h4 className="m-0">
					Make sure every term has at least one definition!
				</h4>
				<Link
					className="btn btn-secondary mt-3"
					href={`/class/${classId}/${setId}`}
				>
					Back to set page
				</Link>
			</div>
		);
	}

	const currentTerm = terms[index];
	const userCreatedFlashcards = currentTerm.Flashcards.filter(
		(flashcard) => flashcard.User_Id === userId
	);
	const currentDef =
		userCreatedFlashcards.length > 0
			? userCreatedFlashcards[0]
			: currentTerm.Flashcards[0];

	const frontSide = frontShowingTerms
		? currentTerm.Content
		: currentDef.Content;
	const backSide = frontShowingTerms
		? currentDef.Content
		: currentTerm.Content;

	const numLearning = reviewTerms.length;

	const otherUserFlashcards = currentTerm.Flashcards.filter(
		(flashcard) => flashcard.User_Id !== userId && flashcard != currentDef
	);

	const toggleIsShuffled = () => {
		const newIsShuffled = !isShuffled;
		setIsShuffled(newIsShuffled);

		const unshuffledArrayPart = inSortingMode
			? terms.slice(0, index)
			: set.Terms.slice(0, index);
		const shuffledArrayPart = inSortingMode
			? shuffle(terms.slice(index))
			: shuffle(set.Terms.slice(index));
		console.log(reviewTerms.slice(index));
		if (newIsShuffled)
			setTerms(unshuffledArrayPart.concat(shuffledArrayPart));
		// need filter to keep terms in same order when in sorting mode
		else
			setTerms(
				inSortingMode
					? set.Terms.filter((term) => terms.includes(term))
					: set.Terms
			);
	};

	const flipCard = () => {
		// setIsShowingFront((prevIsShowingFront) => {
		// 	setIsShowingFront(!prevIsShowingFront)
		// })
		setHasFlipped(true);
		setIsShowingFront(!isShowingFront);
	};

	const toNextCard = () => {
		setHasFlipped(false);
		setIndex(index + 1);
		setIsShowingFront(true);
	};

	const toPrevCard = () => {
		setHasFlipped(false);
		setIndex(index - 1);
		setIsShowingFront(true);
	};

	// const saveCardToReview = () => {
	// 	setReviewTerms([...reviewTerms, terms[index]]);
	// 	toNextCardSortingMode(true);
	// }

	const toNextCardSortingMode = (pressedX) => {
		// we need this line bc just setReviewTerms(~~~) is async, happens after whole fnxn done
		let newReviewTerms = pressedX
			? [...reviewTerms, terms[index]]
			: reviewTerms;

		if (pressedX)
			// always want to save if pressed x, also handles numLearning
			setReviewTerms(newReviewTerms);

		if (index === numTerms - 1) {
			// restart flashcards (slightly diff)
			setIndex(0);
			setNumKnown(0);

			if (isShuffled)
				// reshuffle so cards in diff order
				newReviewTerms = shuffle(newReviewTerms);

			setTerms(newReviewTerms);
			setReviewTerms([]); // handles numLearning

			if (newReviewTerms.length > 0) setViewBufferScreen(true);

			return;
		}

		if (!pressedX)
			// must stay here, do not put as else
			setNumKnown(numKnown + 1);

		toNextCard();
	};

	return (
		<div
			className={
				inSortingMode && index == numTerms
					? `d-none`
					: `review-page-container h-100 p-3`
			}
		>
			<div className="d-flex justify-content-between">
				<BackButton url={`/class/${classId}/${setId}`} />
				{otherUserFlashcards.length > 0 && (
					<button
						className={`${styles.fadeIn} btn btn-primary`}
						data-bs-toggle="modal"
						data-bs-target="#flashcards-modal"
					>
						See {otherUserFlashcards.length} other{" "}
						{otherUserFlashcards.length > 1
							? "definitions"
							: "definition"}
					</button>
				)}
			</div>

			<FlashcardsModal flashcards={otherUserFlashcards} />

			<div className="review-container mt-3 gap-3 d-flex flex-column align-items-center">
				<h3 className="m-0">{set.Name} </h3>

				<div
					className={`${styles.termNumbers} d-flex justify-content-between`}
				>
					<p className={`${styles.learningTerms}`}>
						{inSortingMode ? "Learning: " + numLearning : ""}
					</p>
					<p className="text-center">
						{index + 1}/{numTerms}
					</p>
					<p className={`${styles.knownTerms} text-end`}>
						{inSortingMode ? "Known: " + numKnown : ""}
					</p>
				</div>

				<div
					className={`${styles.card} ${
						!hasFlipped ? styles.hasNotFlipped : ""
					} ${
						!isShowingFront ? styles.flip : ""
					} card p-3 d-flex justify-content-center align-items-center text-center`}
					onClick={flipCard}
				>
					<div
						className={`${styles.front} h-100 w-100 d-flex justify-content-center align-items-center text-center p-3`}
					>
						<p>{frontSide}</p>
					</div>

					<div
						className={`${styles.back} h-100 w-100 d-flex justify-content-center align-items-center text-center p-3`}
					>
						<p>{backSide}</p>
					</div>

					{/* {set.Terms.map((term) => (
						<p className="m-0" key={`term-${term.Term_Id}`}>{term.Content}</p>
					))} */}
				</div>

				<div
					className={`${styles.reviewButtons} d-flex justify-content-between`}
				>
					<button
						type="button"
						data-bs-toggle="modal"
						data-bs-target="#optionsModal"
					>
						<Icon path={mdiDotsHorizontal} size={1.75} />
					</button>

					<div
						className="modal fade"
						id="optionsModal"
						tabIndex="-1"
						aria-labelledby="optionsModalLabel"
						aria-hidden="true"
					>
						<div className="modal-dialog modal-dialog-centered">
							<div className="modal-content">
								<div className="modal-header">
									<h5
										className="modal-title"
										id="optionsModalLabel"
									>
										Options
									</h5>
									<button
										type="button"
										className="btn-close"
										data-bs-dismiss="modal"
										aria-label="Close"
									></button>
								</div>
								<div
									className={`${styles.modalBody} modal-body d-flex flex-column gap-3 p-4`}
								>
									<div className="d-flex justify-content-between align-items-center">
										<p className="m-0">Answer with</p>
										<div className="dropdown">
											<button
												className={`${styles.dropdownToggle} btn dropdown-toggle`}
												type="button"
												id="dropdownMenuButton"
												data-bs-toggle="dropdown"
												aria-expanded="false"
											>
												{frontShowingTerms
													? "Definition"
													: "Term"}
											</button>
											<ul
												className={`${styles.dropdownMenu} dropdown-menu`}
												aria-labelledby="dropdownMenuButton"
											>
												<li>
													<button
														className="dropdown-item"
														onClick={() => {
															setHasFlipped(
																false
															);
															setIsShowingFront(
																true
															);
															setFrontShowingTerms(
																false
															);
														}}
													>
														Term
													</button>
												</li>
												<li>
													<button
														className="dropdown-item"
														onClick={() => {
															setHasFlipped(
																false
															);
															setIsShowingFront(
																true
															);
															setFrontShowingTerms(
																true
															);
														}}
													>
														Definition
													</button>
												</li>
											</ul>
										</div>
									</div>
									<div>
										<div className="d-flex justify-content-between">
											<p>Sorting mode</p>
											<div className="form-check form-switch">
												<input
													className={`${styles.switchButton} form-check-input`}
													onChange={() => {
														const newInSortingMode =
															!inSortingMode;
														setInSortingMode(
															newInSortingMode
														);
														if (!newInSortingMode)
															setTerms(set.Terms);
														restartFlashcards();
													}}
													type="checkbox"
													checked={
														inSortingMode
															? true
															: false
													}
												/>
											</div>
										</div>
										<p className={`${styles.smallText}`}>
											Turn this on to focus on terms you
											need to review more.
										</p>
									</div>

									<button
										className={`${styles.restartCardsButton} m-auto mt-2 mb-2`}
										onClick={restartFlashcards}
										data-bs-dismiss="modal"
									>
										Restart flashcards
									</button>
								</div>
							</div>
						</div>
					</div>

					<div className="">
						<button
							className={`btn ${
								index === 0 && !inSortingMode ? "disabled" : ""
							} p-0`}
							onClick={
								inSortingMode
									? () => {
											toNextCardSortingMode(true);
									  }
									: toPrevCard
							}
						>
							<Icon
								path={
									inSortingMode
										? mdiCloseCircleOutline
										: mdiArrowLeftCircleOutline
								}
								size={2}
								color={
									inSortingMode
										? `var(--medium-light-red)`
										: `var(--light-blue-green)`
								}
							/>
						</button>
						<button
							className={`btn ${
								index === numTerms - 1 && !inSortingMode
									? "disabled"
									: ""
							} p-0`}
							onClick={
								inSortingMode
									? () => {
											toNextCardSortingMode(false);
									  }
									: toNextCard
							}
						>
							<Icon
								path={
									inSortingMode
										? mdiCheckCircleOutline
										: mdiArrowRightCircleOutline
								}
								size={2}
								color={
									inSortingMode
										? `var(--green)`
										: `var(--light-blue-green)`
								}
							/>
						</button>
					</div>

					<button className="" onClick={toggleIsShuffled}>
						<Icon
							path={mdiShuffle}
							size={1.75}
							color={
								isShuffled ? `var(--light-blue-green)` : `black`
							}
						/>
					</button>
				</div>
			</div>
		</div>
	);
}
