"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudyGuide({ setId, classId }) {
	const router = useRouter();
	const [set, setSet] = useState(null);

	const fetchSet = async () => {
		const response = await fetch(`/api/set/${setId}`);
		const fetchedSet = await response.json();
		setSet(fetchedSet);
	};

	useEffect(() => {
		fetchSet();
	}, []);

	return <div className={`w-100 p-5`}> {JSON.stringify(set)} </div>;
}
