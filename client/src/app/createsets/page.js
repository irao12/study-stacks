import CreateSets from "./components/CreateSets";

export default function Index() {
	return (
		<main id="create-sets-page">
			<div
				className={`w-100 h-100 d-flex justify-content-center align-items-center`}
			>
				<CreateSets />
			</div>
		</main>
	);
}
