import Link from "next/link";
import ClassPage from "./components/ClassPage";

export default function Index() {
	return (
		<main id="class-page" className="p-3">
			<div className={`h-100 w-100`}>
				<ClassPage />
			</div>
		</main>
	);
}
