"use client";
import React, { useEffect, useState } from "react";
import CreateClassModal from "./CreateClassModal.js";
import ViewClass from "./ViewClass.js";

export default function ClassPage() {
	const [classes, setClasses] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const displayClasses = async (e) => {
		setIsLoading(true);
		const res = await fetch("/api/class/viewclass");
		const classes = await res.json();
		if (!res.ok) {
			setErrorMessage("Failure to view classes");
		}
		if (res.ok) {
			setClasses(classes);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		displayClasses();
	}, []);

	return (
		<div className="d-flex flex-column py-3">
			<CreateClassModal refreshClasses={displayClasses} />

			<div className="d-flex justify-content-between align-items-center">
				<h4>Classes</h4>
				<button
					data-bs-toggle="modal"
					data-bs-target="#create-class-modal"
					className="btn btn-primary"
					type="button"
				>
					Create Class
				</button>
			</div>
			{isLoading && (
				<div className="w-100 mt-3 d-flex justify-content-center">
					<div className="spinner-border" role="status"></div>
				</div>
			)}
			{!isLoading && (
				<ViewClass
					refreshClasses={displayClasses}
					classes={classes}
				></ViewClass>
			)}
		</div>
	);
}
