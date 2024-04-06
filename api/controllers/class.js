const router = require("express").Router();
const { Class, ClassAccess, Set, User } = require("../models");

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

router.post("/addToClass", async (req, res) => {
	if (!req.user)
		return res.status(401).json({ message: "User is not authenticated" });
	console.log(req.body);
	const classId = req.body.classId;
	const email = req.body.email;

	try {
		const classToAddTo = await Class.findByPk(classId);
		if (!classToAddTo)
			return res.status(400).json({ message: "Class does not exist" });
		const user = await User.findOne({ where: { Email: email } });
		if (!user)
			return res
				.status(400)
				.json({ message: "User with the email does not exist" });
		const classAccess = await ClassAccess.findOne({
			where: { Class_Id: classId, User_Id: user.User_Id },
		});
		if (classAccess)
			return res
				.status(400)
				.json({ message: "User is already added to the class" });
		await classToAddTo.addUser(user);
		const users = await classToAddTo.getUsers({
			attributes: ["First_Name", "Last_Name", "Email"],
		});
		return res
			.status(200)
			.json({ message: "Successfully added the user", users: users });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "An error occurred while adding user to class",
		});
	}
});

router.get("/viewclass", async (req, res) => {
	try {
		const classes = await req.user.getClasses();
		res.status(200).json(classes);
	} catch (error) {
		console.log(error);
		res.status(500).json({
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
			include: [
				{
					model: User,
					attributes: ["First_Name", "Last_Name", "Email"],
				},
				{ model: Set },
			],
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
		return res.status(500).json({
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
