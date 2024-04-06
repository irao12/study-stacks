import React from "react";

export default function NotFound() {
	return (
		<main
			className={`h-100 d-flex flex-column justify-content-center align-items-center`}
		>
			<div className="not-found d-flex flex-column justify-content-center align-items-center gap-3">
				<h4>Not Found</h4>
				<a href="/">
					<button type="button" className="btn btn-primary">
						Back to Home Page
					</button>
				</a>
			</div>
		</main>
	);
}
