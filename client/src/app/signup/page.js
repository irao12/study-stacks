import SignUp from "./components/SignUp";

export default function Index() {
	return (
		<main id="sign-up-page">
			<div
				className={`w-100 h-100 d-flex justify-content-center align-items-center`}
			>
				<SignUp />
			</div>
		</main>
	);
}
