const router = require("express").Router();
const { Set: Set, Term: Term } = require("../models");

// GET /api/term/:setId
router.post("/:setId", async (req, res) => {
	const setId = req.params.setId;
	const term = req.body.term.trim();
	const set = await Set.findOne({ where: { Set_Id: setId } });
	const existingTerm = await Term.findOne({
		where: { Term: term, Set_Id: set.Set_Id },
	});
	if (existingTerm !== null) {
		res.status(400).json({
			isSuccess: false,
			message: "a term already exists",
		});
		return;
	}
	const newTerm = await Term.create({ Term: term });
	newTerm.setSet(set);
	res.json(newTerm);
});

module.exports = router;
