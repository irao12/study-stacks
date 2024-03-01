const router = require("express").Router();
// const { Study_Guides: Study_Guides } = require("../models");
const { Flashcards: Flashcards } = require("../models");

// url: /api/auth/signup
router.post("/createsets", (req, res) => {
	console.log("POST body: ", req.body);
	Flashcards.create({
		Prompt: req.body.prompt,
		Content: req.body.content,
	})
	.catch((error) => {
		console.log(error);
		res.status(400).json({ message: error.errors[0].message });
	});
});

module.exports = router;
