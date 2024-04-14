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
export default function QuestionInterface({
	question,
	sendAnswer,
	isInBufferPeriod,
	playersAnsweredCount,
	playerCount,
}) {
	const [selectedAnswer, setSelectedAnswer] = useState(null);

	const chooseAnswer = (index) => {
		if (selectedAnswer !== null || isInBufferPeriod) return;
		setSelectedAnswer(index);
		sendAnswer(index);
	};

	useEffect(() => {
		setSelectedAnswer(null);
	}, [question]);

	return (
		<div className="mt-3 d-flex flex-column">
			{!isInBufferPeriod && (
				<p className="align-self-end">
					{playersAnsweredCount}/{playerCount} Answered
				</p>
			)}
			<h3>
				Question {question.number}
				{") "}
			</h3>
			<h4 className="my-4">{question.term}</h4>

			<div className="options d-flex flex-column flex-md-row gap-3">
				{question.options.map((option, index) => {
					let optionClassName = `card p-3 col-lg-3 ${
						selectedAnswer === null
							? styles.questionOption
							: "pe-none disabled"
					}`;

					if (selectedAnswer !== null) {
						if (
							selectedAnswer === index &&
							isInBufferPeriod &&
							index === question.answerIndex
						)
							optionClassName += `${styles.selectedQuestionOption} ${styles.correctAnswer}`;
						else if (
							selectedAnswer === index &&
							isInBufferPeriod &&
							index !== question.answerIndex
						)
							optionClassName += `${styles.questionOption} ${styles.incorrectAnswer}`;
						else if (
							isInBufferPeriod &&
							index === question.answerIndex
						)
							optionClassName += `${styles.questionOption} ${styles.correctAnswer}`;
						else if (selectedAnswer === index)
							optionClassName += `${styles.questionOption} ${styles.selectedQuestionOption}`;
						else
							optionClassName += `${styles.questionOption} ${styles.disabledQuestionOption}`;
					} else if (isInBufferPeriod)
						optionClassName += `pe-none disabled ${styles.disabledQuestionOption}`;

					return (
						<div
							key={`option-${index}`}
							onClick={() => {
								chooseAnswer(index);
							}}
							className={optionClassName}
						>
							{index + 1}. {option}
						</div>
					);
				})}
			</div>
		</div>
	);
}
