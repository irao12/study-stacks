import React from "react";
import styles from "./setCard.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SetCard({ set }) {
	const router = useRouter();

	return (
		<Link
			href={`/class/${set.Class_Id}/${set.Set_Id}`}
			className={`card p-3 ${styles.setCard} d-flex justify-content-center`}
		>
			<h6>{set.Name}</h6>
		</Link>
	);
}
