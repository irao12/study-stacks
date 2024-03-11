"use client";
import React, { useEffect, useState } from "react";
import TermCard from "./TermCard";

export default function SetPage({ userId, setId }) {
	const [isLoading, setIsLoading] = useState(true);
	const [set, setSet] = useState(null);
	const [newTermName, setNewTermName] = useState("");
	const [error, setError] = useState(null);

	const getSetData = async () => {
		setIsLoading(true);
		const response = await fetch(`/api/set/${setId}`);
		const fetchedSet = await response.json();
		setSet(fetchedSet);
		console.log(fetchedSet);
		setIsLoading(false);
	};

	const createTerm = async () => {
		if (newTermName.trim() === "") return;
		setIsLoading(true);
		const response = await fetch(`/api/term/${setId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ term: newTermName }),
		});
		if (!response.ok) {
			const responseBody = await response.json();
			setError(responseBody.message);
			setIsLoading(false);
			return;
		}

		setError(null);
		setNewTermName("");
		getSetData();
		setIsLoading(false);
	};

	useEffect(() => {
		getSetData();
	}, []);

	return (
		<div className="p-3 h-100">
			{isLoading && (
				<div className="w-100 d-flex justify-content-center">
					<div className="spinner-border" role="status"></div>
				</div>
			)}

			{set && <h5>{set.Name}</h5>}
			{set && (
				<div className="card mt-3">
					<div className="card-header p-3 d-flex justify-content-between">
						<div>Terms</div>
						<button
							className="btn btn-primary"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#add-term-collapse"
							aria-expanded="false"
							aria-controls="add-term-collapse"
						>
							+
						</button>
					</div>
					<div className="collapse" id="add-term-collapse">
						<div className="card p-3">
							<form
								className="d-flex flex-column"
								onSubmit={async (e) => {
									e.preventDefault();
									await createTerm();
								}}
							>
								{error !== null && (
									<div className="alert alert-danger">
										{error}
									</div>
								)}

								<div className="form-group mb-3">
									<label htmlFor="new-term-name">
										New Term
									</label>
									<input
										type="text"
										name="name"
										value={newTermName}
										onChange={(e) => {
											setNewTermName(e.target.value);
										}}
										className="form-control mt-2"
										id="new-term-name"
										required
									/>
								</div>
								<button
									className="btn btn-success align-self-end"
									type="submit"
								>
									Add Term
								</button>
							</form>
						</div>
					</div>

					<div className="card-body p-0">
						{set.Terms.length > 0 ? (
							set.Terms.map((term) => (
								<TermCard
									key={`term-${term.Term_Id}`}
									term={term}
									userId={userId}
									setId={setId}
									refresh={getSetData}
								/>
							))
						) : (
							<p className="p-4 m-0">
								This set does not have terms yet
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
