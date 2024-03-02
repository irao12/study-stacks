import CreateCards from "./components/CreateCards";

export default function Index() {
	return (
		<main id="create-cards-page">
			<div
				className={`w-100 h-100 d-flex justify-content-center align-items-center`}
			>
				<CreateCards />
			</div>
		</main>
	);
}
