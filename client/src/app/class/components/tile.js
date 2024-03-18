"use client";

import styles from './tile.css'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function Tile(props) {
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState("");
    const [currentContentData, setCurrentContentData] = useState("");
    const [contentData, setContentData] = useState("");

    // useEffect(() => {
	// 	setCurrentContentData(props.card.Name);
	// }, []);


    return (
        <div className="tile">
            <div className="tile-body">
                <h5 className="tile-title">Biology</h5>
                <div className="icon-text">
                    <h5 className="tile-sets"><i className="fas fa-folder"></i> 3  </h5>
                </div>
                <div className="icon-text">
                    <h5 className="tile-users"><i className="fas fa-user"></i> 10 </h5>
                </div>
            </div>
        </div>
    );
}
        
		// <div className="tile">
            
		// 	{/* <button
		// 		type="button"
		// 		className="btn-close"
		// 		aria-label="Close"
		// 		onClick={deleteCard}
		// 	></button> */}
		// 	<div className="tile-body">
		// 		{/* <h5 className="tile-title">{currentContentData}</h5> */}

        //         <h5 className="tile-title">Biology</h5>
        //         <h5 className="tile-users">10</h5>
        //         <h5 className="tile-sets">3</h5>

				
				
		// 	</div>
		// </div>
