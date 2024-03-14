import React from "react";
import styles from "./setCard.module.css";
import { useRouter } from "next/navigation";

export default function SetCard({ set }) {
	const router = useRouter();
	const goToSetPage = () => {
		router.push(`/class/${set.Class_Id}/${set.Set_Id}`);
	};

	return (
		<div
			onClick={goToSetPage}
			className={`card p-3 ${styles.setCard} d-flex justify-content-center`}
		>
			<h6>{set.Name}</h6>
		</div>
	);
}
