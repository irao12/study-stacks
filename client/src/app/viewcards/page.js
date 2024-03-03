import ViewCards from "./components/ViewCards";

export default function Index() {
	return (
		<main id="view-cards-page">
			<div
				className={`w-100 h-100 d-flex justify-content-center align-items-center`}
			>
				<ViewCards api_url={process.env.API_URL}/>
			</div>
		</main>
	);
}
