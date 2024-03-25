import React from "react";
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
	return (
		<div className="mt-5">
			<h3>
				Question {question.number}
				{") "}
			</h3>
			<h4 className="my-5">{question.term}</h4>

			<div className="options d-flex row g-3">
				{question.options.map((option, index) => {
					return (
						<div
							key={`option-${index}`}
							className={`card p-3 col-lg-3 ${styles.questionOption}`}
						>
							{index + 1}. {option}
						</div>
					);
				})}
			</div>
		</div>
	);
}
