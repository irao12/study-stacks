import ViewSets from "./components/ViewSets";

export default function Index() {
	return (
		<main id="view-sets-page">
			<div
				className={`w-100 h-100 d-flex justify-content-center align-items-center`}
			>
				<ViewSets />
			</div>
		</main>
	);
}
