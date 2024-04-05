"use client";
import React, { useEffect, useState } from "react";
import "./class.css";
import CreateClass from "./CreateClass.js";
import ViewClass from "./ViewClass.js";

export default function ClassPage() {
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
		<div className="body">
			<h1 className="title">Classes</h1>

			<CreateClass refreshClasses={displayClasses}></CreateClass>
			<ViewClass
				refreshClasses={displayClasses}
				classes={classes}
			></ViewClass>
		</div>
	);
}
