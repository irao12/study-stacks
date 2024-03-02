const router = require("express").Router();
const { Flashcard: Flashcard } = require("../models");

// url: /api/auth/signup
router.post("/createcards", (req, res) => {
	console.log("POST body: ", req.body);
	Flashcard.create({
		Set_Id: 0,
		Prompt: req.body.prompt,
		Content: req.body.content,
	})
	.then(card => {
		// res.status(201).json({message: "Card Created!"});
		res.status(201).json(card);
	})
	.catch((error) => {
		console.log(error);
		res.status(400).json({ message: error.errors[0].message });
	});
});

router.get("/viewallcards", (req, res) => {
	res.send('GET request sent')
	.catch((error) => {
		console.log(error);
		res.status(400).json({ message: error.errors[0].message });
	});
});

module.exports = router;
