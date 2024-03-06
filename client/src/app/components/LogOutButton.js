"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./navbar.module.css";

export default function LogOutButton() {
	const router = useRouter();

	const onLogOutClicked = async () => {
		const response = await fetch("/auth-api/logout", {
			method: "POST",
		});
		if (response.ok) {
			router.replace("/");
			router.refresh();
		}
	};

	return (
		<button className={`${styles.logOutButton}`} onClick={onLogOutClicked}>
			Log Out
		</button>
	);
}
