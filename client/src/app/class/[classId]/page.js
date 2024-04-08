import React from "react";
import { headers } from "next/headers";
import ClassSets from "./components/ClassSets";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AddUserToClassModal from "./components/AddUserToClassModal";
import Icon from "@mdi/react";
import { mdiPen, mdiTrashCan } from "@mdi/js";
import Link from "next/link";
import UpdateClassModal from "./components/UpdateClassModal";
import DeleteClassModal from "./components/DeleteClassModal";
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
				<>
					<AddUserToClassModal
						classId={classToView.Class_Id}
						classUsers={classToView.Users}
					/>
					<UpdateClassModal classToUpdate={classToView} />
					<DeleteClassModal classToDelete={classToView} />
				</>
			)}

			<div className="p-3">
				<div className="w-100 d-flex justify-content-between">
					<Link className="btn btn-primary" href={`/class`}>
						Back
					</Link>
					{isOwner && (
						<div className="d-flex gap-2">
							<button
								type="button"
								className="btn btn-primary d-flex justify-content-center align-items-center p-2 align-self-end"
								data-bs-toggle="modal"
								data-bs-target="#update-class-modal"
							>
								<Icon path={mdiPen} size={0.75} />
							</button>
							<button
								type="button"
								data-bs-toggle="modal"
								data-bs-target="#delete-class-modal"
								className="btn btn-danger d-flex justify-content-center align-items-center p-2 align-self-end"
							>
								<Icon path={mdiTrashCan} size={0.75} />
							</button>
						</div>
					)}
				</div>
				<div className="w-100 mt-3 d-flex justify-content-between">
					<div className="d-flex flex-row align-items-center gap-3">
						<h4 className="m-0">{classToView.Name}</h4>
					</div>
					<div className="d-flex gap-3">
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
						<Link
							className="btn btn-primary"
							href={`/class/${classId}/studybattle`}
						>
							Study Battle
						</Link>
					</div>
				</div>
				<ClassSets classId={classId} isOwner={isOwner} />
			</div>
		</main>
	);
}
