"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudyGuide({ setId, classId }) {
	const router = useRouter();
	const [termsAndSummaries, setTermsAndSummaries] = useState(null);

	const fetchSet = async () => {
		const response = await fetch(`/api/set/${setId}`);
		if (response.ok) {
			const fetchedSet = await response.json();
			let summaries = Object.values(fetchedSet["Terms"]).map(
				(term) => term["Summary"]
			);
			if (summaries.some((summary) => summary))
				organizeTermsAndSummaries(fetchedSet);
			return;
		}
	};

	const generateGuide = async () => {
		const response = await fetch(`/api/set/createsummaries/${setId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (response.ok) {
			const fetchedSet = await response.json();
			organizeTermsAndSummaries(fetchedSet);
			return;
		}
	};

	const deleteGuide = async () => {
		const response = await fetch(`/api/set/removesummaries/${setId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});
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
		<div className={`w-100 p-5`}>
			{termsAndSummaries ? (
				<>
					<button onClick={generateGuide}>
						Regenerate Study Guide
					</button>
					<button onClick={deleteGuide}>Delete Study Guide</button>
				</>
			) : (
				<button onClick={generateGuide}>Generate Study Guide</button>
			)}
			<table className="">
				{termsAndSummaries &&
					Object.keys(termsAndSummaries).map((term) => (
						<tr>
							<td className="border border-primary">{term}</td>
							<td className="border border-primary">
								{termsAndSummaries[term]}
							</td>
						</tr>
					))}
			</table>
		</div>
	);
}
