"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./flashcard.module.css";
import Icon from "@mdi/react";
import { mdiTrashCan, mdiPen, mdiCancel } from "@mdi/js";

export default function Flashcard({ card, onDelete, classId }) {
	const router = useRouter();

	const [isEditing, setIsEditing] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [currentContentData, setCurrentContentData] = useState("");
	const [changeCardValue, setChangeCardValue] = useState("");

	const deleteCard = async (e) => {
		const res = await fetch("/api/flashcard/deletecard", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				Flashcard_Id: card["Flashcard_Id"],
				Class_Id: classId,
			}),
		});

		if (!res.ok) {
			setErrorMessage("Failure to view cards");
		}
		if (res.ok) {
			await onDelete();
		}
	};

	const toggleEditing = () => {
		setIsEditing(!isEditing);
		setChangeCardValue(currentContentData);
	};

	const handleContentChange = (e) => {
		const { value } = e.target;
		setChangeCardValue(value);
	};

	const updateFlashCard = async (e) => {
		e.preventDefault();
		const res = await fetch("/api/flashcard/updatecard", {
			method: "POST",
			mode: "cors", // no-cors, *cors, same-origin
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				Content: changeCardValue,
				Flashcard_Id: card["Flashcard_Id"],
				Class_Id: classId,
			}),
		});
		if (!res.ok) {
			const resJson = await res.json();
			setErrorMessage(resJson.message);
		}
		if (res.ok) {
			setIsEditing(false);
			setCurrentContentData(changeCardValue);
		}
	};

	useEffect(() => {
		setCurrentContentData(card["Content"]);
	}, []);

	return (
		<div className="w-100 d-flex flex-column gap-1">
			<div className="d-flex gap-2 align-self-end">
				<button
					type="button"
					className="btn btn-primary d-flex justify-content-center align-items-center p-1 align-self-end"
					onClick={toggleEditing}
					data-bs-toggle="tooltip"
					title={isEditing ? "Cancel" : "Edit"}
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
					className="btn btn-danger d-flex justify-content-center align-items-center p-1 align-self-end"
					onClick={deleteCard}
				>
					<Icon path={mdiTrashCan} size={1} />
				</button>
			</div>

			<div>
				{!isEditing && (
					<div className="card-text h5 p-0">{currentContentData}</div>
				)}
				{isEditing && (
					<form onSubmit={updateFlashCard}>
						<div className="d-flex flex-column">
							<textarea
								type="text"
								id="Content"
								className={`form-control ${styles.changeCardInput}`}
								name="Content"
								value={changeCardValue}
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
		</div>
	);
}
