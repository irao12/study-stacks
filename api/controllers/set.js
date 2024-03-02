const router = require("express").Router();
const { Set: Set } = require("../models");

// url: /api/set/:classId
router.get("/:classId", (req, res) => {
	// const user = req.user;
	// // TODO: check if user has access to the class
	// if (!user) {
	// 	res.status(401);
	// }
	const classId = req.params.classId;
	console.log(Set);
	Set.findAll({ where: { Class_Id: classId } })
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

// url: /api/set/:classId
router.post("/:classId", (req, res) => {
	// const user = req.user;
	// // TODO: check if user has access to class and can edit
	// if (!user) {
	// 	res.status(401).json({
	// 		message: "user does not have access to the class",
	// 	});
	// }
	const classId = req.params.classId;
	const newSet = req.body;
	Set.create({
		Name: newSet.Name,
		Class_Id: classId,
	})
		.then((set) => {
			res.json(set);
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json({ message: error.errors[0].message });
		});
});

module.exports = router;
