const router = require("express").Router();
const { Flashcard: Flashcard } = require("../models");

router.post("/createcards", (req, res) => {
	console.log("POST body: ", req.body);
	Flashcard.create({
		Set_Id: 0,
		User_Id: req.user.User_Id,
		Term_Id: 0,
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

router.get("/viewcards", (req, res) => {
	try{
		Flashcard.findAll({
			where: {
				User_Id: req.user.User_Id,
			}
		})
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
		Content: req.body.Content,
	},
	{
		where: {
			Flashcard_Id: req.body.Flashcard_Id,
		}
	})
	.then((cards) => {
		res.status(201).json(cards);
	})
	.catch((error) => {
		console.log(error);
		res.status(400).json({ message: error.message });
	});
});

router.post("/deletecards", (req, res) => {
	Flashcard.destroy({
		where: {
			Flashcard_Id: req.body.Flashcard_Id,
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
