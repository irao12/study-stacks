import Link from "next/link";
import React from "react";

// example of a set
// {
//   Set_Id: 1,
//   Name: 'Biology',
//   Class_Id: 0,
//   Terms: [ { Term_Id: 1, Content: 'Test', Set_Id: 1, Flashcards: [] } ]
// }

export default function Review({ set, setId, classId }) {
	return (
		<div className="p-3">
			<button className="btn btn-primary" type="button">
				<Link href={`/class/${classId}/${setId}`}>Back</Link>
			</button>
			<div className="mt-3">
				<h3>Review {set.Name} </h3>

				{set.Terms.map((term) => (
					<p key={`term-${term.Term_Id}`}>{term.Content}</p>
				))}
			</div>
		</div>
	);
}
