import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./navbar.module.css";
import LogOutButton from "./LogOutButton";
import logo from "../../assets/Study_Stacks_Logo.PNG";

export default function Navbar({ user }) {
	return (
		<nav
			className={`${styles.navSection} navbar navbar-light justify-content-between p-3`}
		>
			<Link href="/">
				<div className="d-flex align-items-center gap-3">
					<Image
						src={logo}
						className={`${styles.logo}`}
					/>
					<h4 className="m-0 flex-grow-0">StudyStacks</h4>
				</div>
			</Link>
			<div className="nav-buttons d-flex gap-3">
				{user !== null && <Link href="/class">Classes</Link>}
				{user === null ? (
					<Link href="/login" className="text-white">
						Log In
					</Link>
				) : (
					<LogOutButton />
				)}
			</div>
		</nav>
	);
}
