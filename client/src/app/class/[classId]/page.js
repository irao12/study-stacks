import React from "react";
import { headers } from "next/headers";
import ClassSets from "./components/ClassSets";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
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

	return (
		<main>
			<div className="p-3">
				<h4>{classToView.Name}</h4>
				<ClassSets classId={classId} classSets={classToView.Sets} />
			</div>
		</main>
	);
}
