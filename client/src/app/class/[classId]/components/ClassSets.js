"use client";

import React, { useEffect, useState } from "react";
import SetCard from "./SetCard";

export default function ClassSets({ classId, isOwner }) {
	const [sets, setSets] = useState([]);
	const [newSetName, setNewSetName] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const getSetsForClass = async () => {
		setIsLoading(true);
		const response = await fetch(`/api/set/class/${classId}`);
		const classSets = await response.json();
		setSets(classSets);
		setIsLoading(false);
	};

	const createSet = async () => {
		const response = await fetch(`/api/set/${classId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ Name: newSetName }),
		});
		if (response.ok) {
			await getSetsForClass();
		}
	};

	useEffect(() => {
		getSetsForClass();
	}, []);

	return (
		<div className="pt-3 mt-3">
			<div className="d-flex justify-content-between align-items-center">
				<h4>Sets for this class</h4>
				{!isLoading && (
					<button
						className="btn btn-tertiary"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#collapseExample"
						aria-expanded="false"
						aria-controls="collapseExample"
					>
						Add Set
					</button>
				)}
			</div>

			<div className="collapse mt-3" id="collapseExample">
				<div className="card p-3">
					<form
						onSubmit={async (e) => {
							e.preventDefault();
							await createSet();
						}}
					>
						<div className="form-group mb-3">
							<label htmlFor="new-set-name">Set Name</label>
							<input
								type="text"
								name="name"
								value={newSetName}
								onChange={(e) => {
									setNewSetName(e.target.value);
								}}
								className="form-control mt-2"
								id="new-set-name"
								required
							/>
						</div>
						<button className="btn btn-success" type="submit">
							Create Set
						</button>
					</form>
				</div>
			</div>

			<div className="mt-3 d-flex align-items-center gap-3 flex-wrap flex-column flex-sm-row">
				{sets.length > 0 &&
					sets.map((set) => <SetCard key={set.Set_Id} set={set} />)}
				{isLoading && (
					<div className="w-100 d-flex justify-content-center">
						<div className="spinner-border" role="status"></div>
					</div>
				)}
			</div>
		</div>
	);
}
