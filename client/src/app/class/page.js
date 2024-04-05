import ClassPage from "./components/ClassPage";

export default function Index() {
	return (
		<main id="class-page">
			<link
				href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
				rel="stylesheet"
			/>
			<div
				className={`w-100 h-100 d-flex justify-content-center align-items-center`}
			>
				<ClassPage />
			</div>
		</main>
	);
}
