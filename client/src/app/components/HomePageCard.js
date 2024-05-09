"use client";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import Link from "next/link";
import styles from "./homePageCard.module.css"

export default function HomePageCard({ user }) {
    const [randomQuote, setRandomQuote] = useState(null); 
    const [showingQuote, setShowingQuote] = useState(true);

    useEffect(() => {
        fetch('/api/quote')
        .then((response) => {
            if (!response.ok) {
                setRandomQuote({
                    content: "Never give up!",
                    author: "StudyStacks Team"
                });
                return;
            }
            response.json().then((quote) => {
                setRandomQuote(quote);
            })
        })
    }, []);

    const flipCard = () => {
		setShowingQuote(!showingQuote);
	};

    if (!user) {
        return (
            <div className={`${styles.card} card d-flex justify-content-center align-items-center text-center p-3`}>
                <Link href="/signup">Sign up today!</Link>
            </div>
        );
    }

    return (
        <div 
            className={`${styles.card} ${styles.quoteCard} ${!showingQuote ? styles.flip : ""}
                        card d-flex justify-content-center align-items-center text-center`}
            onClick={flipCard}
        >
            {randomQuote 
                ? <>
                    <div className={`${styles.front} h-100 w-100 d-flex justify-content-center align-items-center text-center p-3`}>
                        <q>{randomQuote.content}</q>
                    </div>
                    <div className={`${styles.back} h-100 w-100 d-flex justify-content-center align-items-center text-center p-3`}>
                        <p className="m-0">{randomQuote.author}</p>
                    </div>
                </>
                : <Loader/>}
        </div>
    );
}
