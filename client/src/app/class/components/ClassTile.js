"use client";

import styles from "./tile.css";
import Link from "next/link";

export default function ClassTile({ classToView, onDelete }) {
	return (
		<Link
			href={`class/${classToView["Class_Id"]}`}
			className="card tile p-3 d-flex flex-column justify-content-center"
		>
			<div className="tile-title h-100 d-flex align-items-center">
				<div className="card-text h5 p-0 ">{classToView.Name}</div>
			</div>
		</Link>
	);
}
