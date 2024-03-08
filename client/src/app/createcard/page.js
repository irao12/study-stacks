import CreateCard from "./components/CreateCard";

export default function Index() {
	return (
		<main id="create-cards-page">
			<div
				className={`w-100 h-100 d-flex justify-content-center align-items-center`}
			>
				<CreateCard />
			</div>
		</main>
	);
}
