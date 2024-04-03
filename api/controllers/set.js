const router = require("express").Router();
const {
	Set: Set,
	Term: Term,
	Flashcard: Flashcard,
	Summary: Summary,
} = require("../models");
const Summarizer = require("../summarizer");

// url: /api/set/class/:classId
router.get("/class/:classId", (req, res) => {
	// const user = req.user;
	// // TODO: check if user has access to the class
	// if (!user) {
	// 	res.status(401);
	// }
	const classId = req.params.classId;
	Set.findAll({
		where: { Class_Id: classId },
		include: [
			{
				model: Term,
				include: Flashcard,
			},
		],
	})
		.then((sets) => {
			res.json(sets);
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json({
				message: "could not find the sets for the class",
			});
		});
});

// url: /api/set/summary/:classId
// router.post("/summary/:setId", (req, res) => {
router.get("/createsummaries/:setId", (req, res) => {
	let summarizer = new Summarizer();
	const setId = req.params.setId;

	// Find the set we are working with
	Set.findOne({
		where: { Set_Id: setId },
		include: [
			{
				model: Term,
				include: Flashcard,
			},
		],
	})
		.then((set) => {
			// Organize data so we can summarize
			data = {};
			for (let term of set["Terms"]) {
				let Term_Id = term["Term_Id"];
				data[Term_Id] = [];
				for (let flashcard of term["Flashcards"]) {
					data[Term_Id].push(flashcard["Content"]);
				}
			}

			for (let Term_Id of Object.keys(data)) {
				// let summary = summarizer.summarize(data[Term_Id]);
				let summary = "This is a test 123!!!";
				// If summary already exists, we should update instead of create
				const existingSummary = Summary.findOne({
					where: { Term_Id: Term_Id },
				})
					.then((existingSummary) => {
						if (!existingSummary) {
							Summary.create({
								Term_Id: Term_Id,
								Content: summary,
							}).catch((error) => {
								console.log(error);
								res.status(400).json({
									message: "Error making summary",
								});
							});
						} else {
							existingSummary
								.update({
									Content: summary,
								})
								.catch((error) => {
									console.log(error);
									res.status(400).json({
										message: "Failed to update summary",
									});
								});
						}
					})
					.catch((error) => {
						console.log(error);
						res.status(400).json({
							message: "Failed to find set",
						});
					});
			}
			// Get final output to send back
			Set.findOne({
				where: { Set_Id: setId },
				include: [
					{
						model: Term,
						include: [Flashcard, Summary],
					},
				],
			})
				.then((outputSet) => res.json(outputSet))
				.catch((error) => {
					console.log(error);
					res.status(400).json({
						message: "could not find the set",
					});
				});
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json({
				message: "could not find the set",
			});
		});
});

router.get("/:setId", (req, res) => {
	const setId = req.params.setId;
	Set.findOne({
		where: { Set_Id: setId },
		include: [
			{
				model: Term,
				include: Flashcard,
			},
		],
	})
		.then((set) => {
			res.json(set);
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json({
				message: "could not find the set for the class",
			});
		});
});

// url: /api/set/:classId
router.post("/:classId", (req, res) => {
	// const user = req.user;
	// // TODO: check if user has access to class and can edit
	// if (!user) {
	// 	res.status(401).json({
	// 		message: "user does not have access to the class",
	// 	});
	// }
	const classId = req.params.classId;
	const newSet = req.body;
	Set.create({
		Name: newSet.Name,
		Class_Id: classId,
	})
		.then((set) => {
			res.json(set);
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json({ message: error.errors[0].message });
		});
});

// url: /api/set/:setId
router.put("/:setId", (req, res) => {
	// const user = req.user;
	// // TODO: check if user has access to class and can edit the set
	// if (!user) {
	// 	res.status(401).json({
	// 		message: "user does not have access to the class",
	// 	});
	// }
	const setId = req.params.setId;
	const modifiedSet = req.body;
	Set.findOne({
		where: {
			Set_Id: setId,
		},
	})
		.then((set) => {
			set.Name = modifiedSet.Name;
			set.save();
			res.json(set);
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json({ message: error.errors[0].message });
		});
});

router.delete("/:setId", (req, res) => {
	// const user = req.user;
	// // TODO: check if user has access to class and can edit the set
	// if (!user) {
	// 	res.status(401).json({
	// 		message: "user does not have access to the class",
	// 	});
	// }
	const setId = req.params.setId;
	const modifiedSet = req.body;
	Set.findOne({
		where: {
			Set_Id: setId,
		},
	})
		.then((set) => {
			set.Name = modifiedSet.Name;
			set.destroy();
			res.status(200).json(set);
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json({ message: error.errors[0].message });
		});
});

module.exports = router;
