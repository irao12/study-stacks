"use client";

import { useState } from "react";
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
					return (
						<ClassTile
							key={`class-${classTile.Class_Id}`}
							classToView={classTile}
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
