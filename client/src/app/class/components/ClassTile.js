"use client";

import styles from "./tile.css";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import Icon from "@mdi/react";
// import { mdiTrashCan, mdiPen, mdiCancel } from "@mdi/js";

export default function ClassTile(props) {
	const router = useRouter();

	const [isEditing, setIsEditing] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [currentContentData, setCurrentContentData] = useState("");
	const [changeTileValue, setChangeTileValue] = useState("");
	const [contentData, setContentData] = useState("");

	const deleteClass = async (e) => {
		const res = await fetch("/api/class/deleteclass", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ Class_Id: props.tile["Class_Id"] }),
		});

		if (!res.ok) {
			setErrorMessage("Failure to view classes");
		}
		if (res.ok) {
			await props.onDelete();
		}
	};

	const toggleEditing = () => {
		setIsEditing((prevIsEditing) => {
			if (prevIsEditing) setIsEditing(false);
			else setIsEditing(true);
		});
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
				Class_Id: props.tile["Class_Id"],
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
		setCurrentContentData(props.tile["Name"]);
	}, []);

	return (
		<div className="tile">
			<div className="d-flex gap-2 align-self-end">
				<button
					type="button"
					className="btn btn-primary d-flex justify-content-center align-items-center p-2 align-self-end"
					onClick={toggleEditing}
					data-bs-toggle="tooltip"
					title={isEditing ? "Cancel" : "Edit"}
				>
					{isEditing ? (
						// <Icon path={mdiCancel} size={1} />
						<i class="fa-solid fa-xmark"></i>
					) : (
						// <Icon path={mdiPen} size={1} />
						<i class="fa-solid fa-xmark"></i>
					)}
				</button>
				<button
					type="button"
					data-bs-toggle="tooltip"
					className="btn btn-danger d-flex justify-content-center align-items-center p-2 align-self-end"
					onClick={deleteClass}
				>
					{/* <Icon path={mdiTrashCan} size={1} /> */}
					<i class="fa-solid fa-xmark"></i>
				</button>
			</div>

			<div className="tile-title">
				{!isEditing && (
					<div className="card-text h5 p-0">
						{/* {currentContentData} */}
						<a
							href={`http://localhost:3000/class/${props.tile["Class_Id"]}`}
						>
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

// 	<div className="tile">
// 	<div className="tile-body">
// 		<h5 className="tile-title"></h5>

// 		<div className="icon-text">
// 			<h5 className="tile-sets"><i className="fas fa-folder"></i> 3  </h5>
// 		</div>
// 		<div className="icon-text">
// 			<h5 className="tile-users"><i className="fas fa-user"></i> 10 </h5>
// 		</div>
// 	</div>
// </div>

// <div className="tile">

// 	{/* <button
// 		type="button"
// 		className="btn-close"
// 		aria-label="Close"
// 		onClick={deleteCard}
// 	></button> */}
// 	<div className="tile-body">
// 		{/* <h5 className="tile-title">{currentContentData}</h5> */}

//         <h5 className="tile-title">Biology</h5>
//         <h5 className="tile-users">10</h5>
//         <h5 className="tile-sets">3</h5>

// 	</div>
// </div>
