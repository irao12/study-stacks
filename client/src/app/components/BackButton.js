import React from "react";
import Link from "next/link";

export default function BackButton({ url }) {
	return (
		<Link className="btn btn-secondary w-auto flex-grow-0" href={url}>
			Back
		</Link>
	);
}
