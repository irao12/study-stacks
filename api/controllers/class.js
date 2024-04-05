const router = require("express").Router();
const { Class, ClassAccess, Set } = require("../models");

router.post("/createclass", async (req, res) => {
	console.log("POST body: ", req.body);
	try {
		const newClass = await Class.create({
			Class_Id: 0,
			User_Id: req.user.User_Id,
			Name: req.body.content,
		});

		await req.user.addClass(newClass, { through: { selfGranted: false } });
		res.status(201).json(newClass);
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: "An error occurred while creating a class",
		});
	}
});

router.get("/viewclass", async (req, res) => {
	try {
		const classes = await req.user.getClasses();
		res.status(200).json(classes);
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: "An error occurred while fetching classes",
		});
	}
});

router.get("/:id", async (req, res) => {
	if (!req.user)
		return res.status(401).json({ message: "user is not authenticated" });

	const classId = req.params.id;
	try {
		const classEntry = await Class.findByPk(classId, {
			include: Set,
		});
		if (!classEntry)
			return res.status(400).json({ message: "class does not exist" });

		const classAccess = await ClassAccess.findOne({
			where: { User_Id: req.user.User_Id, Class_Id: classId },
		});

		if (!classAccess)
			return res.status(400).json({
				doesNotHaveAccess: true,
				message: "user does not have access to the class",
			});

		return res.json(classEntry);
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "An error occurred while fetching a class",
		});
	}
});

router.put("/updateclass", async (req, res) => {
	if (!req.user)
		return res.status(401).json({ message: "user is not authenticated" });

	const classId = req.body.Class_Id;

	try {
		const classToUpdate = await Class.findByPk(classId);
		console.log(classToUpdate);
		if (!classToUpdate)
			return res.status(400).json({ message: "class does not exist" });
		if (req.user.User_Id != classToUpdate.User_Id)
			return res.status(401).json({
				message: "a user must be the owner of a class to update",
			});

		classToUpdate.Name = req.body.Name;
		classToUpdate.save();
		return res.json(classToUpdate);
	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: error.message });
	}
});

router.delete("/deleteclass", async (req, res) => {
	if (!req.user)
		return res.status(401).json({ message: "user is not authenticated" });

	const classId = req.body.Class_Id;
	try {
		const classToDelete = await Class.findByPk(classId);
		if (!classToDelete)
			return res.status(400).json({ message: "class does not exist" });
		if (req.user.User_Id != classToDelete.User_Id)
			return res.status(401).json({
				message: "a user must be the owner of a class to delete",
			});
		classToDelete.destroy();
		return res.json(classToDelete);
	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: error.message });
	}
});

module.exports = router;
