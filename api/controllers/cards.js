const router = require("express").Router();
const { Flashcard: Flashcard, Term: Term, Set: Set } = require("../models");

router.post("/createcard", async (req, res) => {
	const termId = req.body.termId;
	const term = await Term.findOne({
		where: { Term_Id: termId },
		include: Set,
	});
	Flashcard.create({
		Set_Id: term.Set.Set_Id,
		User_Id: req.user.User_Id,
		Term_Id: term.Term_Id,
		Content: req.body.content,
	})
		.then((card) => {
			res.status(201).json(card);
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json({ message: error.errors[0].message });
		});
});

router.get("/viewcard", (req, res) => {
	try {
		Flashcard.findAll({
			where: {
				User_Id: req.user.User_Id,
			},
		}).then((cards) => {
			res.json(cards);
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.errors[0].message });
	}
});

router.post("/updatecard", (req, res) => {
	Flashcard.update(
		{
			Content: req.body.Content,
		},
		{
			where: {
				Flashcard_Id: req.body.Flashcard_Id,
			},
		}
	)
		.then((cards) => {
			res.status(201).json(cards);
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json({ message: error.message });
		});
});

router.post("/deletecard", (req, res) => {
	Flashcard.destroy({
		where: {
			Flashcard_Id: req.body.Flashcard_Id,
		},
	})
		.then(() => {
			res.status(201).json({ message: "Card Deleted!" });
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json({ message: error.errors[0].message });
		});
});

module.exports = router;
