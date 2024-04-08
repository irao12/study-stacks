const router = require("express").Router();
const {
	Class,
	ClassAccess,
	Set,
	Term,
	Flashcard,
	Summary,
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

// url: /api/set/createsummaries/:setId
router.post("/createsummaries/:setId", async (req, res) => {
	let summarizer = new Summarizer();
	const setId = req.params.setId;

	// Find the set we are working with
	let set = await Set.findOne({
		where: { Set_Id: setId },
		include: [
			{
				model: Term,
				include: Flashcard,
			},
		],
	}).catch((error) => {
		console.log(error);
		res.status(400).json({
			message: "could not find the set",
		});
		return;
	});

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
		let summary = await summarizer.summarize(data[Term_Id]);

		await Summary.destroy({
			where: { Term_Id: Term_Id },
		}).catch((error) => {
			console.log(error);
			res.status(400).json({
				message: "Failed to remove existing summary",
			});
		});

		await Summary.create({
			Term_Id: Term_Id,
			Content: summary,
		}).catch((error) => {
			console.log(error);
			res.status(400).json({
				message: "Error making summary",
			});
		});
	}

	// Get final output to send back
	let outputSet = await Set.findOne({
		where: { Set_Id: setId },
		include: [
			{
				model: Term,
				include: [Flashcard, Summary],
			},
		],
	}).catch((error) => {
		console.log(error);
		res.status(400).json({
			message: "could not find the set",
		});
	});
	res.json(outputSet);
});

// url: /api/set/removesummaries/:setId
router.delete("/removesummaries/:setId", async (req, res) => {
	const setId = req.params.setId;

	// Find the set we are working with
	let set = await Set.findOne({
		where: { Set_Id: setId },
		include: [
			{
				model: Term,
				include: Flashcard,
			},
		],
	}).catch((error) => {
		console.log(error);
		res.status(400).json({
			message: "could not find the set",
		});
		return;
	});

	for (let term of set["Terms"]) {
		let Term_Id = term["Term_Id"];
		await Summary.destroy({
			where: { Term_Id: Term_Id },
		}).catch((error) => {
			console.log(error);
			res.status(400).json({
				message: "Failed to remove summary",
			});
		});
	}

	// Get final output to send back
	let outputSet = await Set.findOne({
		where: { Set_Id: setId },
		include: [
			{
				model: Term,
				include: [Flashcard, Summary],
			},
		],
	}).catch((error) => {
		console.log(error);
		res.status(400).json({
			message: "could not find the set",
		});
	});
	res.json(outputSet);
});

router.get("/:setId", (req, res) => {
	const setId = req.params.setId;
	Set.findOne({
		where: { Set_Id: setId },
		include: [
			{
				model: Term,
				include: [Flashcard, Summary],
			},
			{
				model: Class,
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
router.post("/:classId", async (req, res) => {
	const user = req.user;
	if (!user) {
		return res.status(401).json({
			message: "user does not have access to the class",
		});
	}
	const classId = req.params.classId;

	try {
		const classAccess = await ClassAccess.findOne({
			where: { Class_Id: classId, User_Id: user.User_Id },
		});

		if (!classAccess)
			return res
				.status(401)
				.json({ message: "User does not have access to the class." });

		const newSetData = req.body;
		const newSet = await Set.create({
			Name: newSetData.Name,
			Class_Id: classId,
		});
		return res.json(newSet);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.errors[0].message });
	}
});

// url: /api/set/:setId
router.put("/:setId", async (req, res) => {
	const user = req.user;
	if (!user) {
		res.status(401).json({
			message: "user does not have access to the class",
		});
	}

	const setId = req.params.setId;
	const modifiedSet = req.body;
	try {
		const set = await Set.findOne({
			where: {
				Set_Id: setId,
			},
			include: [
				{
					model: Class,
				},
			],
		});

		const classAccess = await ClassAccess.findOne({
			where: { Class_Id: set.Class.Class_Id, User_Id: user.User_Id },
		});
		if (!classAccess)
			return res
				.status(401)
				.json({ message: "User does not have access to the class." });

		set.Name = modifiedSet.Name;
		set.save();
		return res.json(set);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.errors[0].message });
	}
});

router.delete("/:setId", async (req, res) => {
	const user = req.user;
	if (!user) {
		res.status(401).json({
			message: "user does not have access to the class",
		});
	}

	const setId = req.params.setId;

	try {
		const set = await Set.findOne({
			where: {
				Set_Id: setId,
			},
			include: [
				{
					model: Class,
				},
			],
		});

		const classAccess = await ClassAccess.findOne({
			where: { Class_Id: set.Class.Class_Id, User_Id: user.User_Id },
		});
		if (!classAccess)
			return res
				.status(401)
				.json({ message: "User does not have access to the class." });

		set.destroy();
		return res.status(200).json(set);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.errors[0].message });
	}
});

module.exports = router;
