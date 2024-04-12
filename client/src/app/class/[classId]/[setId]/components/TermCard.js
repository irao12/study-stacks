"use client";
import React, { useState } from "react";
import CreateCard from "@/app/createcard/components/CreateCard";
import Flashcard from "@/app/viewcards/components/Flashcard";
import Icon from "@mdi/react";
import { mdiTrashCan, mdiPen, mdiCancel } from "@mdi/js";
import styles from "./termCard.module.css";

export default function TermCard({
	term,
	refresh,
	userId,
	setModalFlashcards,
}) {
	const [isEditing, setIsEditing] = useState(false);
	const [changeTermValue, setChangeTermValue] = useState(term.Content);
	const [termContent, setTermContent] = useState(term.Content);

	const toggleIsEditing = () => {
		setIsEditing(!isEditing);
	};

	const handleContentChange = (e) => {
		const { value } = e.target;
		setChangeTermValue(value);
	};

	const showOtherFlashcards = () => {
		const otherUserFlashcards = term.Flashcards.filter(
			(flashcard) => flashcard.User_Id !== userId
		);
		setModalFlashcards(otherUserFlashcards);
	};

	const updateTerm = async (e) => {
		e.preventDefault();
		const res = await fetch(`/api/term/${term.Term_Id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				Content: changeTermValue,
			}),
		});
		if (!res.ok) {
			const resJson = await res.json();
			return;
		}
		if (res.ok) {
			setIsEditing(false);
			setTermContent(changeTermValue);
		}
	};

	const deleteTerm = async () => {
		const res = await fetch(`/api/term/${term.Term_Id}`, {
			method: "DELETE",
		});
		if (res.ok) {
			await refresh();
		}
	};

	const hasCreatedACard = term.Flashcards.some(
		(card) => card.User_Id === userId
	);

	const userCreatedFlashcards = term.Flashcards.filter(
		(flashcard) => flashcard.User_Id === userId
	);
	const otherUserFlashcards = term.Flashcards.filter(
		(flashcard) => flashcard.User_Id !== userId
	);
	const userCreatedFlashcard =
		userCreatedFlashcards.length > 0 ? userCreatedFlashcards[0] : null;

	return (
		<div className="d-flex flex-column p-3 border-bottom border-primary">
			{otherUserFlashcards.length > 0 && (
				<button
					className="btn btn-primary align-self-end"
					onClick={showOtherFlashcards}
					data-bs-toggle="modal"
					data-bs-target="#flashcards-modal"
				>
					See {otherUserFlashcards.length} other{" "}
					{otherUserFlashcards.length > 1
						? "flashcards"
						: "flashcard"}
				</button>
			)}
			<div className="mt-3 d-flex flex-column flex-md-row gap-5 p-3 h-auto">
				<div className="d-flex flex-column align-items-start gap-1 w-100">
					<div className="d-flex gap-2 align-self-end">
						<button
							type="button"
							className="btn btn-primary d-flex justify-content-center align-items-center p-1"
							data-bs-toggle="tooltip"
							onClick={toggleIsEditing}
						>
							{isEditing ? (
								<Icon path={mdiCancel} size={1} />
							) : (
								<Icon path={mdiPen} size={1} />
							)}
						</button>
						<button
							type="button"
							data-bs-toggle="tooltip"
							className="btn btn-danger d-flex justify-content-center align-items-center p-1"
							title="Delete term"
							onClick={deleteTerm}
						>
							<Icon path={mdiTrashCan} size={1} />
						</button>
					</div>
					{!isEditing && <h4 className="m-0">{termContent}</h4>}
					{isEditing && (
						<form className="w-100" onSubmit={updateTerm}>
							<div className="d-flex flex-column">
								<textarea
									type="text"
									id="Content"
									className={`form-control ${styles.changeTermInput}`}
									name="Content"
									value={changeTermValue}
									onChange={handleContentChange}
								/>
								<button
									className="mt-3 btn btn-success flex-shrink-0 flex-grow-0"
									type="submit"
									value="Submit"
								>
									Save Changes
								</button>
							</div>
						</form>
					)}
				</div>

				{(term.Flashcards.length === 0 || !hasCreatedACard) && (
					<CreateCard refresh={refresh} termId={term.Term_Id} />
				)}
				{term.Flashcards.length > 0 && hasCreatedACard && (
					<Flashcard onDelete={refresh} card={userCreatedFlashcard} />
				)}
			</div>
		</div>
	);
}
