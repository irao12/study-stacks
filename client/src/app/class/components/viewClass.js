"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClassTile from "./ClassTile";

export default function ViewClass() {
	const router = useRouter();

	const [errorMessage, setErrorMessage] = useState("");
	const [classes, setClasses] = useState([]);

	const displayClasses = async (e) => {
		const res = await fetch("/api/class/viewclass", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const classes = await res.json();
		if (!res.ok) {
			setErrorMessage("Failure to view classes");
		}
		if (res.ok) {
			setClasses(classes);
		}
	};
	useEffect(() => {
		displayClasses();
	}, []);

	return (
		<div className={`w-100 p-5`}>
			<h3 className="mb-2 pb-2 mb-3 border-bottom">View Classes</h3>
			{errorMessage !== "" && (
				<div className="alert alert-danger">{errorMessage}</div>
			)}
			{classes.length > 0 ? (
				classes.map((classTile) => {
					// <Flashcard card={card} onDelete={displayCards}/>
					return (
						<ClassTile
							tile={classTile}
							onDelete={displayClasses}
						></ClassTile>
					);
				})
			) : (
				<div> No classes to display </div>
			)}
		</div>
	);
}
