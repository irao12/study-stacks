import React from "react";
import { headers } from "next/headers";
import ClassSets from "./components/ClassSets";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AddUserToClassModal from "./components/AddUserToClassModal";
const apiUrl = process.env.API_URL;

export default async function Index({ params }) {
	const headersList = headers();
	const classId = params.classId;
	const cookieStore = cookies();
	const sessionIdCookie = cookieStore.get("connect.sid");

	const response = await fetch(`${apiUrl}/api/class/${classId}`, {
		cache: "no-store",
		headers: {
			Cookie: `connect.sid=${sessionIdCookie.value};`,
		},
	});

	if (response.status === 401) redirect("/login");
	if (response.status === 400) redirect("/class");

	const classToView = await response.json();

	const user = JSON.parse(headersList.get("user"));
	const isOwner = user.User_Id === classToView.User_Id;

	return (
		<main>
			{isOwner && (
				<AddUserToClassModal
					classId={classToView.Class_Id}
					classUsers={classToView.Users}
				/>
			)}
			<div className="p-3">
				<div className="w-100 d-flex justify-content-between">
					<h4>{classToView.Name}</h4>
					{isOwner && (
						<button
							data-bs-toggle="modal"
							data-bs-target="#add-user-to-class-modal"
							className="btn btn-primary"
							type="button"
						>
							Add User to Class
						</button>
					)}
				</div>
				<ClassSets classId={classId} classSets={classToView.Sets} />
			</div>
		</main>
	);
}
