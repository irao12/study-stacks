const router = require("express").Router();
const { Flashcard: Flashcard } = require("../models");

router.post("/createcards", (req, res) => {
	console.log("POST body: ", req.body);
	Flashcard.create({
		Set_Id: 0,
		Prompt: req.body.prompt,
		Content: req.body.content,
	})
	.then(card => {
		res.status(201).json(card);
	})
	.catch((error) => {
		console.log(error);
		res.status(400).json({ message: error.errors[0].message });
	});
});

router.get("/viewallcards", (req, res) => {
	try{
		Flashcard.findAll()
		.then(cards => {
			res.json(cards);
		})
	}
	catch(error) {
		console.log(error);
		res.status(400).json({ message: error.errors[0].message });
	};
});

router.post("/updatecards", (req, res) => {
	Flashcard.update({
		Prompt: req.body.Prompt,
		Content: req.body.Content,
	},
	{
		where: {
			id: req.body.id,
		}
	})
	.then((cards) => {
		res.status(201).json(cards);
	})
	.catch((error) => {
		console.log(error);
		res.status(400).json({ message: error.errors[0].message });
	});
});

router.post("/deletecards", (req, res) => {
	Flashcard.destroy({
		where: {
			id: req.body.id,
		}
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
