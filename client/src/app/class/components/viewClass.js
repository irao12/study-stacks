"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Tile from "./tile";


export default function ViewClass() {
	const router = useRouter();
	

	const [errorMessage, setErrorMessage] = useState("");
    const [displayedTiles, setDisplayedTiles] = useState([]);

    const displayTiles = async (e) => {
        const res = await fetch("/api/class/viewclass", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
        const tiles = await res.json()
		if (!res.ok) {
			setErrorMessage("Failure to view classes");
		}
		if (res.ok) {
			setDisplayedTiles(tiles);
		}
	};
    useEffect(() => {
		displayTiles();
	}, []);

	

	

	return (
		<div className={`w-100 p-5`}>
			<h3 className="mb-2 pb-2 mb-3 border-bottom">View Classes</h3>
			{errorMessage !== "" && (
				<div className="alert alert-danger">{errorMessage}</div>
			)}
			{
				displayedTiles.length > 0 ? (
					displayedTiles.map((tile) => 
						// <Flashcard card={card} onDelete={displayCards}/>
                        <Tile tile={tile} onDelete={displayTiles}></Tile>
					)
				) : (
					<div> No classes to display </div>
				)
			}
		</div>
	);
}