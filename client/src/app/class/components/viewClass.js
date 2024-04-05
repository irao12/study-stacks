"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClassTile from "./ClassTile";

export default function ViewClass({ classes, refreshClasses }) {
	const router = useRouter();

	const [errorMessage, setErrorMessage] = useState("");

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
							onDelete={refreshClasses}
						></ClassTile>
					);
				})
			) : (
				<div> No classes to display </div>
			)}
		</div>
	);
}
