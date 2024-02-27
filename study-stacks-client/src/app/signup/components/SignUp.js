"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
	const router = useRouter();
	const [inputs, setInputs] = useState({
		firstName: "",
		lastName: "",
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
		console.log("signing up");
		if (
			inputs.email.trim() === "" ||
			inputs.password.trim() === "" ||
			inputs.firstName.trim() === "" ||
			inputs.lastName.trim() === ""
		)
			setErrorMessage("Please enter an email and password");
		const res = await fetch("/api/auth/signup", {
			method: "POST",
			mode: "cors", // no-cors, *cors, same-origin
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(inputs),
		});
		if (res.ok) {
			router.push("/login");
		}
	};

	return (
		<div className={`w-100 card p-5`}>
			<h3 className="mb-2 pb-2 mb-3 border-bottom">Sign Up</h3>
			<form className="w-100 m-auto" onSubmit={onSubmit}>
				<div className="form-group mb-3">
					<label htmlFor="exampleInputEmail1">First Name:</label>
					<input
						type="text"
						name="firstName"
						className="form-control"
						id="first-name-input"
						value={inputs.firstName}
						required
						onChange={handleInputChange}
						placeholder="Enter first name"
					/>
				</div>
				<div className="form-group mb-3">
					<label htmlFor="last-name-input">Last Name:</label>
					<input
						type="text"
						name="lastName"
						className="form-control"
						id="last-name-input"
						value={inputs.lastName}
						required
						onChange={handleInputChange}
						placeholder="Enter last name"
					/>
				</div>
				<div className="form-group mb-3">
					<label htmlFor="exampleInputEmail1">Email:</label>
					<input
						type="email"
						name="email"
						className="form-control"
						id="email-input"
						value={inputs.email}
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
						value={inputs.password}
						required
						onChange={handleInputChange}
						placeholder="Enter password with at least 7 characters"
					/>
				</div>

				<button type="submit" className="btn btn-primary">
					Sign Up
				</button>
			</form>
		</div>
	);
}
