"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./login.module.css";
export default function Login() {
	const router = useRouter();
	const [inputs, setInputs] = useState({
		email: "",
		password: "",
	});

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

				<button type="submit" className="btn btn-primary">
					Login
				</button>
			</form>
		</div>
	);
}
