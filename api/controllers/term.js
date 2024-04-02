const router = require("express").Router();
const { Set: Set, Term: Term } = require("../models");

// POST /api/term/:setId
router.post("/:setId", async (req, res) => {
	const setId = req.params.setId;
	const content = req.body.content.trim();
	const set = await Set.findOne({ where: { Set_Id: setId } });
	const existingTerm = await Term.findOne({
		where: { Content: content, Set_Id: set.Set_Id },
	});
	if (existingTerm !== null) {
		res.status(400).json({
			isSuccess: false,
			message: "a term already exists",
		});
		return;
	}
	const newTerm = await Term.create({ Content: content });
	newTerm.setSet(set);
	res.json(newTerm);
});

router.put("/:termId", (req, res) => {
	// const user = req.user;
	// // TODO: check if user has access to class and can edit the set
	// if (!user) {
	// 	res.status(401).json({
	// 		message: "user does not have access to the class",
	// 	});
	// }
	const termId = req.params.termId;
	const modifiedTerm = req.body;
	Term.findOne({
		where: {
			Term_Id: termId,
		},
	})
		.then((term) => {
			term.Content = modifiedTerm.Content;
			term.save();
			res.json(term);
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json({ message: error.errors[0].message });
		});
});

router.delete("/:termId", async (req, res) => {
	const termId = req.params.termId;
	Term.findOne({
		where: {
			Term_Id: termId,
		},
	})
		.then((term) => {
			term.destroy();
			res.status(200).json(term);
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json({ message: error.errors[0].message });
		});
});

module.exports = router;
