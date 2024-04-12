"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@mdi/react";
import { mdiBook, mdiBookOpenVariant } from "@mdi/js";
import BackButton from "@/app/components/BackButton";
import Loader from "@/app/components/Loader";

export default function StudyGuide({ setId, classId }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [setName, setSetName] = useState(null);
	const [termsAndSummaries, setTermsAndSummaries] = useState(null);

	const fetchSet = async () => {
		const response = await fetch(`/api/set/${classId}/${setId}`);
		if (response.ok) {
			const fetchedSet = await response.json();
			setSetName(fetchedSet.Name);
			let summaries = Object.values(fetchedSet["Terms"]).map(
				(term) => term["Summary"]
			);
			if (summaries.some((summary) => summary))
				organizeTermsAndSummaries(fetchedSet);
		}
		setIsLoading(false);
	};

	const generateGuide = async () => {
		setIsLoading(true);
		const response = await fetch(
			`/api/set/createsummaries/${classId}/${setId}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (response.ok) {
			const fetchedSet = await response.json();
			organizeTermsAndSummaries(fetchedSet);
		}
		setIsLoading(false);
	};

	const deleteGuide = async () => {
		const response = await fetch(
			`/api/set/removesummaries/${classId}/${setId}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (response.ok) {
			setTermsAndSummaries(null);
			return;
		}
	};

	const organizeTermsAndSummaries = (set) => {
		let data = {};
		for (let termId of Object.keys(set["Terms"])) {
			let term = set["Terms"][termId];
			let content = term["Content"];
			let summary = term["Summary"];
			if (summary) data[content] = summary["Content"];
		}
		setTermsAndSummaries(data);
	};

	useEffect(() => {
		fetchSet();
	}, []);

	return (
		<div className="p-3">
			<BackButton url={`/class/${classId}/${setId}`} />

			{isLoading && <Loader />}

			{!isLoading && (
				<div className={`w-100 mt-3 d-flex flex-column`}>
					<div className="d-flex gap-1 align-items-center">
						<Icon path={mdiBookOpenVariant} size={1.25} />
						<h4 className="m-0">Study Guide for {setName}</h4>
					</div>
					{termsAndSummaries ? (
						<div className="mt-3 align-self-end d-flex gap-2">
							<button
								className="btn btn-primary"
								onClick={generateGuide}
							>
								Regenerate Study Guide
							</button>
							<button
								className="btn btn-danger"
								onClick={deleteGuide}
							>
								Delete Study Guide
							</button>
						</div>
					) : (
						<button
							className="btn btn-primary w-auto mt-3"
							onClick={generateGuide}
						>
							Generate Study Guide
						</button>
					)}

					{termsAndSummaries && (
						<div className="card p-4 mt-3">
							<h4 className="border-bottom pb-3">{setName}</h4>
							<div className="summaries mt-3">
								{Object.keys(termsAndSummaries).map(
									(term, index) => (
										<div key={`summary-${index}`}>
											<h5>{term}</h5>
											<p className="ms-5">
												{termsAndSummaries[term]}
											</p>
										</div>
									)
								)}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
