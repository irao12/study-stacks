import ClassPage from "./components/ClassPage";

export default function Index() {
	return (
		<main id="class-page">
			<div
				className={`w-100 h-100 d-flex justify-content-center align-items-center`}
			>
				<ClassPage />
			</div>
		</main>
	);
}
