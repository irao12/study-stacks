import React, { useEffect, useState } from "react";

export default function SortingModeBufferScreen({
    styles,
    set,
    terms,
    setViewBufferScreen,
    restartFlashcards,
}) {
    const [randomQuote, setRandomQuote] = useState(null); 

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
                console.log(quote);
            })
        })
    }, []);

    return (
        <div className="d-flex flex-column justify-content-center align-items-center h-100 p-3">
            <div
                className={`${styles.endScreenCard} card d-flex flex-column justify-content-center align-items-center gap-3 p-3 text-center`}
            >
                <h2 className={`${styles.endScreenText}`}>
                    {terms.length}
                    {terms.length != 1 ? " terms" : " term"} left to study!
                </h2>
                <h4>
                    {set.Terms.length - terms.length}/{set.Terms.length}{" "}
                    terms learned
                </h4>
                {randomQuote &&
                    <div className={`${styles.quote} m-3`}>
                        <q>{randomQuote.content}</q>
                        <p> - {randomQuote.author}</p>
                    </div>
                }
                <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3">
                    <button
                        className="btn btn-primary fs-5 text-center col-md-6 col-12"
                        onClick={() => {
                            setViewBufferScreen(false);
                        }}
                    >
                        Continue studying
                    </button>
                    <button
                        className="btn btn-secondary fs-5 text-center col-md-6 col-12"
                        onClick={restartFlashcards}
                    >
                        Restart flashcards
                    </button>
                </div>
            </div>
        </div>
    );
}