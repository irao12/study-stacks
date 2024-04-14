"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./login.module.css";
import Link from "next/link";
import Loader from "@/app/components/Loader";

export default function Login() {
	const router = useRouter();
	const [inputs, setInputs] = useState({
		email: "",
		password: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleInputChange = (e) => {
		setInputs({
			...inputs,
			[e.target.name]: e.target.value,
		});
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		if (inputs.email.trim() === "" || inputs.password.trim() === "")
			setErrorMessage("Please enter an email and password");
		setIsLoading(true);
		const res = await fetch("/auth-api/login", {
			method: "POST",
			// mode: "cors", // no-cors, *cors, same-origin
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(inputs),
		});

		if (res.ok) {
			router.push("/");
			router.refresh();
		} else {
			setErrorMessage("Invalid credentials");
		}

		setIsLoading(false);
	};

	return (
		<div className={`${styles.loginSection} w-100 card p-5`}>
			<h3 className="mb-2 pb-2 mb-3 border-bottom">Login</h3>
			<form className="w-100 m-auto" onSubmit={onSubmit}>
				<div className="form-group mb-3">
					<label htmlFor="exampleInputEmail1">Email:</label>
					<input
						type="email"
						name="email"
						className="form-control"
						id="email-input"
						value={inputs.Email}
						required
						onChange={handleInputChange}
						placeholder="Enter email"
					/>
				</div>

				<div className="form-group mb-3">
					<label htmlFor="exampleInputPassword1">Password</label>
					<input
						type="password"
						name="password"
						className="form-control"
						id="password-input"
						value={inputs.Password}
						required
						onChange={handleInputChange}
						placeholder="Password"
					/>
				</div>

				{errorMessage !== "" && (
					<div className="alert alert-danger">{errorMessage}</div>
				)}

				{isLoading && <Loader />}

				<button type="submit" className="w-100 btn btn-primary mt-3">
					Login
				</button>
			</form>
			<Link
				className={`${styles.signUpLink} mt-4 align-self-center`}
				href="/signup"
			>
				Don't have an account? Click here to sign up!
			</Link>
		</div>
	);
}
