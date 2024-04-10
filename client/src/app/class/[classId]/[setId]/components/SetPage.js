"use client";
import React, { useEffect, useState } from "react";
import TermCard from "./TermCard";
import Icon from "@mdi/react";
import { mdiFolder, mdiPen, mdiTrashCan } from "@mdi/js";
import Link from "next/link";
import Flashcards from "./FlashcardsModal";
import UpdateSetModal from "./UpdateSetModal";
import DeleteSetModal from "./DeleteSetModal";

export default function SetPage({ userId, setId, classId }) {
	const [isLoading, setIsLoading] = useState(true);
	const [isOwner, setIsOwner] = useState(false);
	const [set, setSet] = useState(null);
	const [newTermName, setNewTermName] = useState("");
	const [error, setError] = useState(null);
	const [modalFlashcards, setModalFlashcards] = useState([]);

	const getSetData = async () => {
		setIsLoading(true);
		const response = await fetch(`/api/set/${setId}`);
		const fetchedSet = await response.json();
		setSet(fetchedSet);
		console.log(fetchedSet);
		if (fetchedSet.Class["User_Id"] === userId) setIsOwner(true);
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
			body: JSON.stringify({ content: newTermName }),
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
		<>
			{set && (
				<>
					<UpdateSetModal set={set} refresh={getSetData} />
					<DeleteSetModal set={set} />
				</>
			)}
			{modalFlashcards && <Flashcards flashcards={modalFlashcards} />}
			<div className="h-100">
				<div className="d-flex justify-content-between">
					<Link
						className="btn btn-secondary"
						href={`/class/${classId}`}
					>
						Back
					</Link>
					{set && (
						<div className="d-flex gap-2">
							<button
								type="button"
								className="btn btn-primary d-flex justify-content-center align-items-center p-2 align-self-end"
								data-bs-toggle="modal"
								data-bs-target="#update-set-modal"
							>
								<Icon path={mdiPen} size={0.75} />
							</button>
							<button
								type="button"
								data-bs-toggle="modal"
								data-bs-target="#delete-set-modal"
								className="btn btn-danger d-flex justify-content-center align-items-center p-2 align-self-end"
							>
								<Icon path={mdiTrashCan} size={0.75} />
							</button>
						</div>
					)}
				</div>

				{isLoading && (
					<div className="w-100 d-flex justify-content-center">
						<div className="spinner-border" role="status"></div>
					</div>
				)}

				{set && (
					<>
						<div className="d-flex justify-content-between mt-3">
							<div className="d-flex gap-1">
								<Icon path={mdiFolder} size={1.25} />
								<h4 className="m-0">{set.Name}</h4>
							</div>
							<Link
								className="btn btn-primary"
								href={`/class/${classId}/${setId}/review`}
							>
								Review
							</Link>
						</div>
						<div className="card mt-3">
							<div className="card-header p-3 d-flex justify-content-between">
								<div>Terms</div>
								<button
									className="btn btn-tertiary"
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
													setNewTermName(
														e.target.value
													);
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
											setModalFlashcards={
												setModalFlashcards
											}
										/>
									))
								) : (
									<p className="p-4 m-0">
										This set does not have terms yet
									</p>
								)}
							</div>
						</div>
					</>
				)}
			</div>
		</>
	);
}
