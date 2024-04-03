"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudyGuide({ setId, classId }) {
	const router = useRouter();
	const [termsAndSummaries, setTermsAndSummaries] = useState(null);

	const fetchSetAndSummaries = async () => {
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

	const organizeTermsAndSummaries = (set) => {
		let data = {};
		for (let termId of Object.keys(set["Terms"])) {
			let term = set["Terms"][termId];
			let content = term["Content"];
			let summary_key = Object.keys(term["Summaries"])[0];
			let summary = term["Summaries"][summary_key];
			if (summary) data[content] = summary["Content"];
		}
		setTermsAndSummaries(data);
	};

	useEffect(() => {
		fetchSetAndSummaries();
	}, []);

	return (
		<div className={`w-100 p-5`}>
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
