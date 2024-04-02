"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudyGuide({ setId, classId }) {
	const router = useRouter();
	const [set, setSet] = useState(null);
	const [organizedData, setOrganizedData] = useState(null);

	const fetchSet = async () => {
		const response = await fetch(`/api/set/${setId}`);
		const fetchedSet = await response.json();
		setSet(fetchedSet);
	};

	const organizeTermsDefinitions = (set) => {
		let data = {};
		for (let term of set["Terms"]) {
			let content = term["Content"];
			data[content] = [];
			for (let flashcard of term["Flashcards"]) {
				data[content].push(flashcard["Content"]);
			}
		}
		return data;
	};

	useEffect(() => {
		fetchSet();
	}, []);

	useEffect(() => {
		if (set) {
			let data = organizeTermsDefinitions(set);
			setOrganizedData(data);
		}
	}, [set]);

	return (
		<div className={`w-100 p-5`}>
			<table className="">
				{organizedData &&
					Object.keys(organizedData).map((term) => (
						<tr>
							<td className="border border-primary">{term}</td>
							<td className="border border-primary">
								{organizedData[term]}
							</td>
						</tr>
					))}
			</table>
		</div>
	);
}
