"use client";

import styles from "./tile.css";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@mdi/react";
import { mdiTrashCan, mdiPen, mdiCancel } from "@mdi/js";

export default function ClassTile({ tile, onDelete }) {
	const router = useRouter();

	const [isEditing, setIsEditing] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [currentContentData, setCurrentContentData] = useState("");
	const [changeTileValue, setChangeTileValue] = useState("");
	const [contentData, setContentData] = useState("");

	const deleteClass = async (e) => {
		e.preventDefault();
		const res = await fetch("/api/class/deleteclass", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ Class_Id: tile["Class_Id"] }),
		});

		if (!res.ok) {
			setErrorMessage("Failure to view classes");
		}
		if (res.ok) {
			await onDelete();
		}
	};

	const toggleEditing = (e) => {
		setIsEditing(!isEditing);
		setChangeTileValue(currentContentData);
	};

	const handleContentChange = (e) => {
		const { value } = e.target;
		setChangeTileValue(value);
	};

	const updateTile = async (e) => {
		e.preventDefault();
		const res = await fetch("/api/class/updateclass", {
			method: "PUT",
			mode: "cors", // no-cors, *cors, same-origin
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				Name: changeTileValue,
				Class_Id: tile["Class_Id"],
			}),
		});
		if (!res.ok) {
			const resJson = await res.json();
			setErrorMessage(resJson.message);
		}
		if (res.ok) {
			setIsEditing(false);
			setCurrentContentData(changeTileValue);
		}
	};

	useEffect(() => {
		setCurrentContentData(tile["Name"]);
	}, []);

	return (
		<div
			href={`class/${tile["Class_Id"]}`}
			className="card tile p-3 d-flex flex-column"
		>
			<div className="align-self-end d-flex gap-2 align-self-end">
				<button
					type="button"
					className="btn btn-primary d-flex justify-content-center align-items-center p-2 align-self-end"
					onClick={toggleEditing}
					data-bs-toggle="tooltip"
					title={isEditing ? "Cancel" : "Edit"}
				>
					{isEditing ? (
						<Icon path={mdiCancel} size={0.75} />
					) : (
						<Icon path={mdiPen} size={0.75} />
					)}
				</button>
				<button
					type="button"
					data-bs-toggle="tooltip"
					className="btn btn-danger d-flex justify-content-center align-items-center p-2 align-self-end"
					onClick={deleteClass}
				>
					<Icon path={mdiTrashCan} size={0.75} />
				</button>
			</div>

			<div className="tile-title">
				{!isEditing && (
					<div className="card-text h5 p-0">
						<a href={`/class/${tile.Class_Id}`}>
							{currentContentData}
						</a>
					</div>
				)}
				{isEditing && (
					<form onSubmit={updateTile}>
						<div className="d-flex flex-column">
							<textarea
								type="text"
								id="Name"
								className={`form-control ${styles.changeTileInput}`}
								name="Name"
								value={changeTileValue}
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
