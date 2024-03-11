const router = require("express").Router();
const { Set: Set, Term: Term } = require("../models");

// url: /api/set/class/:classId
router.get("/class/:classId", (req, res) => {
	// const user = req.user;
	// // TODO: check if user has access to the class
	// if (!user) {
	// 	res.status(401);
	// }
	const classId = req.params.classId;
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

router.get("/:setId", (req, res) => {
	const setId = req.params.setId;
	console.log(Term);
	Set.findOne({ where: { Set_Id: setId }, include: Term })
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

// url: /api/set/:setId
router.put("/:setId", (req, res) => {
	// const user = req.user;
	// // TODO: check if user has access to class and can edit the set
	// if (!user) {
	// 	res.status(401).json({
	// 		message: "user does not have access to the class",
	// 	});
	// }
	const setId = req.params.setId;
	const modifiedSet = req.body;
	Set.findOne({
		where: {
			Set_Id: setId,
		},
	})
		.then((set) => {
			set.Name = modifiedSet.Name;
			set.save();
			res.json(set);
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json({ message: error.errors[0].message });
		});
});

router.delete("/:setId", (req, res) => {
	// const user = req.user;
	// // TODO: check if user has access to class and can edit the set
	// if (!user) {
	// 	res.status(401).json({
	// 		message: "user does not have access to the class",
	// 	});
	// }
	const setId = req.params.setId;
	const modifiedSet = req.body;
	Set.findOne({
		where: {
			Set_Id: setId,
		},
	})
		.then((set) => {
			set.Name = modifiedSet.Name;
			set.destroy();
			res.status(200).json(set);
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json({ message: error.errors[0].message });
		});
});

module.exports = router;
