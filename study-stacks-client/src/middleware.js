import { redirect } from "next/dist/server/api-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const publicRoutes = ["/login", "/", "/signup"];

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
	// check for session
	const sessionIdCookie = request.cookies.get("connect.sid");
	if (!sessionIdCookie) {
		// if user is trying to enter a private route, redirect them to login
		if (!publicRoutes.includes(request.nextUrl.pathname))
			return NextResponse.redirect(new URL("/login", request.url));
		else {
			return NextResponse.next();
		}
	}

	// get user from cookie
	const res = await fetch("http://localhost:8080/api/auth/login", {
		method: "GET",
		headers: {
			Cookie: `connect.sid=${sessionIdCookie.value};`,
		},
	});
	if (!res.ok) {
		// if route is public, don't do anything
		if (publicRoutes.includes(request.nextUrl.pathname)) return;
		// if route is private, direct to login
		return NextResponse.redirect(new URL("/login", request.url));
	} else if (
		request.nextUrl.pathname === "/login" ||
		request.nextUrl.pathname === "/signup"
	)
		return NextResponse.redirect(new URL("/", request.url));

	const user = await res.json();
	console.log(user);

	return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: ["/", "/login", "/signup"],
};
