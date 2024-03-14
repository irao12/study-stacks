"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Carousel } from "bootstrap";

export default function Kahoot() {
	const router = useRouter();

	const [errorMessage, setErrorMessage] = useState("");

	return (
		<div className={`w-100 p-5`}>
			<h3 className="mb-2 pb-2 mb-3 border-bottom">Kahoot</h3>
			<button>Connect Socket</button>
		</div>
	);
}
