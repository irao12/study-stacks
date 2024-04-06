"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClassTile from "./ClassTile";

export default function ViewClass({ classes, refreshClasses }) {
	const router = useRouter();

	const [errorMessage, setErrorMessage] = useState("");

	return (
		<div className="w-100 mt-3 d-flex flex-wrap gap-3">
			{errorMessage !== "" && (
				<div className="alert alert-danger">{errorMessage}</div>
			)}
			{classes.length > 0 ? (
				classes.map((classTile) => {
					// <Flashcard card={card} onDelete={displayCards}/>
					return (
						<ClassTile
							key={`class-${classTile.Class_Id}`}
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
