"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ViewCards() {
	const router = useRouter();

	const [errorMessage, setErrorMessage] = useState("");

	return (
		<div className={`w-100 card p-5`}>
			<h3 className="mb-2 pb-2 mb-3 border-bottom">View Cards</h3>
		</div>
	);
}
