const router = require("express").Router();
const { Summary: Summary } = require("../models");

// POST /api/summary/:termId
router.post("/:termId", async (req, res) => {
	const termId = req.params.termId;
	const existingSummary = await Summary.findOne({
		where: { Term_Id: termId },
	});
	if (existingSummary !== null) {
		res.status(400).json({
			isSuccess: false,
			message: "a summary already exists",
		});
		return;
	}
	const newSummary = await Summary.create({ Content: "Dummy" });
	res.json(newSummary);
});

// router.put("/:termId", (req, res) => {
// 	// const user = req.user;
// 	// // TODO: check if user has access to class and can edit the set
// 	// if (!user) {
// 	// 	res.status(401).json({
// 	// 		message: "user does not have access to the class",
// 	// 	});
// 	// }
// 	const termId = req.params.termId;
// 	const modifiedTerm = req.body;
// 	Term.findOne({
// 		where: {
// 			Term_Id: termId,
// 		},
// 	})
// 		.then((term) => {
// 			term.Content = modifiedTerm.Content;
// 			term.save();
// 			res.json(term);
// 		})
// 		.catch((error) => {
// 			console.log(error);
// 			res.status(400).json({ message: error.errors[0].message });
// 		});
// });

// router.delete("/:termId", async (req, res) => {
// 	const termId = req.params.termId;
// 	Term.findOne({
// 		where: {
// 			Term_Id: termId,
// 		},
// 	})
// 		.then((term) => {
// 			term.destroy();
// 			res.status(200).json(term);
// 		})
// 		.catch((error) => {
// 			console.log(error);
// 			res.status(400).json({ message: error.errors[0].message });
// 		});
// });

module.exports = router;
