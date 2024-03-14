import ClassesPage from "./components/classes";
import Classes from "./components/classes";

export default function Index() {
	return (
		<main id="classes-page">
			<div
				className={`w-100 h-100 d-flex justify-content-center align-items-center`}
			>
				<ClassesPage />
			</div>
		</main>
	);
}