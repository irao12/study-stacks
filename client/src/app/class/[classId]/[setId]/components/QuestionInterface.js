import React, { useState, useEffect } from "react";
import styles from "./questionInterface.module.css";

// example of a question:
// {
// 	"term": "Eyes",
// 	"options": [
// 		"Organs needed for breathing. Organs needed for breathing. Organs needed for breathing. Organs needed for breathing. Organs needed for breathing. Organs needed for breathingdas",
// 		"Organ used for digestion",
// 		"Organs used for seeing",
// 		"The brain is an organ used for thinking. It has neurons."
// 	],
// 	"answerIndex": 2
// }
export default function QuestionInterface({ question }) {
	const [selectedAnswer, setSelectedAnswer] = useState();

	const chooseAnswer = (index) => {
		setSelectedAnswer(index);
	};

	useEffect(() => {}, [question]);

	return (
		<div className="mt-5">
			<h3>
				Question {question.number}
				{") "}
			</h3>
			<h4 className="my-5">{question.term}</h4>

			<div className="options d-flex row g-3">
				{question.options.map((option, index) => {
					console.log(index, selectedAnswer);
					return (
						<div
							key={`option-${index}`}
							onClick={() => {
								chooseAnswer(index);
							}}
							className={
								`card p-3 col-lg-3 ${styles.questionOption}` +
								(selectedAnswer === index
									? " selected"
									: " disabled")
							}
						>
							{index + 1}. {option}
						</div>
					);
				})}
			</div>
		</div>
	);
}
