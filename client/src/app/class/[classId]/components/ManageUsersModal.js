"use client";
import Icon from "@mdi/react";
import { mdiTrashCan } from "@mdi/js";
import React, { useState } from "react";

export default function ManageUsersModal({ classId, classUsers, ownerId }) {
	const [emailAddress, setEmailAddress] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [users, setUsers] = useState(classUsers ?? []);

	const addUserToClass = async (e) => {
		e.preventDefault();
		const response = await fetch("/api/class/addToClass", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ classId: classId, email: emailAddress }),
		});

		if (!response.ok) {
			const body = await response.json();
			if (body.message) {
				setErrorMessage(body.message);
				setSuccessMessage("");
			}
			return;
		}

		const body = await response.json();

		setEmailAddress("");
		setUsers(body.users);
		setErrorMessage("");
		setSuccessMessage(body.message);
	};

	const removeUserFromClass = async (userId) => {
		const response = await fetch("/api/class/removeuser", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ classId: classId, userId: userId }),
		});

		if (!response.ok) {
			const body = await response.json();
			if (body.message) {
				setErrorMessage(body.message);
				setSuccessMessage("");
			}
			return;
		}

		const body = await response.json();

		setUsers(body.users);
		setErrorMessage("");
		setSuccessMessage(body.message);
	};

	return (
		<div className="modal modal-xl" id="add-user-to-class-modal">
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Add User to Class</h5>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div className="modal-body p-3">
						<form onSubmit={addUserToClass}>
							<div className="d-flex flex-column">
								<div className="mb-3">
									<label
										htmlFor="exampleInputEmail1"
										className="form-label"
									>
										User's Email Address
									</label>
									<input
										type="email"
										value={emailAddress}
										onChange={(e) => {
											setEmailAddress(e.target.value);
										}}
										className="form-control"
										id="add-user-email"
										aria-describedby="emailHelp"
									/>
								</div>
								{errorMessage !== "" && (
									<div className="w-100 alert alert-danger">
										{errorMessage}
									</div>
								)}
								{successMessage !== "" && (
									<div className="w-100 alert alert-success">
										{successMessage}
									</div>
								)}
								<button
									type="submit"
									className="btn btn-primary align-self-end"
								>
									Submit
								</button>
							</div>
						</form>
						<div className="user-list mt-3">
							<h6>Users</h6>
							<ul>
								{users.map((user) => {
									return (
										<li key={`user-${user.Email}`}>
											<div className="d-flex align-items-center gap-2 mb-3">
												<h6 className="mb-0">
													{user.First_Name}{" "}
													{user.Last_Name} [
													{user.Email}]
												</h6>
												{user.User_Id !== ownerId && (
													<>
														<button
															className="btn btn-danger d-flex justify-content-center align-items-center flex-shrink-0 p-2"
															id={`delete-dropdown-button-${user.User_Id}`}
															data-bs-toggle="dropdown"
															aria-expanded="false"
														>
															<Icon
																path={
																	mdiTrashCan
																}
																size={0.75}
															/>
														</button>
														<ul
															className="dropdown-menu py-3"
															aria-labelledby={`delete-dropdown-button-${user.User_Id}`}
														>
															<p className="px-3">
																Are you sure you
																want to remove
																this user?
															</p>
															<div className="px-3">
																<button
																	className="btn btn-danger"
																	onClick={() => {
																		removeUserFromClass(
																			user.User_Id
																		);
																	}}
																>
																	Confirm
																</button>
															</div>
														</ul>
													</>
												)}
											</div>
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
