"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudyGuide() {
	const router = useRouter();

	useEffect(() => {}, []);

	return <div className={`w-100 p-5`}> Hello </div>;
}
