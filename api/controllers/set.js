const router = require("express").Router();
const checkClassAccess = require("../middlewares/classAccess");
const {
	Class,
	ClassAccess,
	Set,
	Term,
	Flashcard,
	Summary,
} = require("../models");
const OpenAI = require("openai");
const Summarizer = require("../summarizer");

// url: /api/set/class/:classId
router.get("/class/:classId", checkClassAccess, async (req, res) => {
	const classId = req.params.classId;
	const user = req.user;

	try {
		const classToView = await Class.findByPk(classId, {
			include: [
				{
					model: Set,
					include: [
						{
							model: Term,
							include: Flashcard,
						},
					],
				},
			],
		});

		return res.json(classToView.Sets);
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: "could not find the sets for the class",
		});
	}
});

// url: /api/set/createsummaries/:classId/:setId
router.post(
	"/createsummaries/:classId/:setId",
	checkClassAccess,
	async (req, res) => {
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
			data[Term_Id] = [[], ""];
			data[Term_Id][1] = term["Content"];
			for (let flashcard of term["Flashcards"]) {
				data[Term_Id][0].push(flashcard["Content"]);
			}
		}

		try {
			for (let Term_Id of Object.keys(data)) {
				let summary = await summarizer.summarize(
					data[Term_Id][0],
					data[Term_Id][1]
				);

				if (summary.error) {
					console.log(
						`OpenAI: ${summary.status} - ${summary.error.message}`
					);
					throw summary;
				}

				await Summary.destroy({
					where: { Term_Id: Term_Id },
				}).catch((error) => {
					console.log(error);
					res.status(400).json({
						message: "Failed to remove existing summary",
					});
					return;
				});

				await Summary.create({
					Term_Id: Term_Id,
					Content: summary,
				}).catch((error) => {
					console.log(error);
					res.status(400).json({
						message: "Error making summary",
					});
					return;
				});
			}
		} catch (error) {
			if (error.status == 429)
				res.status(500).json({
					message: "OpenAI - ran out of credits",
				});
			else
				res.status(500).json({
					message: "Could not obtain response from the OpenAI API",
				});
			return;
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
			return;
		});
		res.json(outputSet);
	}
);

// url: /api/set/removesummaries/:classId/:setId
router.delete(
	"/removesummaries/:classId/:setId",
	checkClassAccess,
	async (req, res) => {
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
	}
);

// url: /api/set/:classId/:setId
router.get("/:classId/:setId", checkClassAccess, async (req, res) => {
	const setId = req.params.setId;
	try {
		const set = await Set.findByPk(setId, {
			include: [
				{
					model: Term,
					include: [Flashcard, Summary],
				},
				{
					model: Class,
				},
			],
		});

		if (!set) return res.status(400).json({ message: "Set was not found" });

		res.json(set);
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: "could not find the set for the class",
		});
	}
});

// url: /api/set/:classId
router.post("/:classId", checkClassAccess, async (req, res) => {
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

// url: /api/set/:classId/:setId
router.put("/:classId/:setId", checkClassAccess, async (req, res) => {
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

		set.Name = modifiedSet.Name;
		await set.save();
		return res.json(set);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.errors[0].message });
	}
});

// url: /api/set/:classId/:setId
router.delete("/:classId/:setId", checkClassAccess, async (req, res) => {
	const setId = req.params.setId;
	console.log(setId);
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

		await set.destroy();
		return res.status(200).json(set);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.errors[0].message });
	}
});

module.exports = router;
