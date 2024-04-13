const { Class } = require("../models");

const checkClassAccess = async (req, res, next) => {
	const user = req.user;

	if (!user)
		return res.status(401).json({ message: "User is not authenticated" });
	let classId = req.params.classId || req.body.Class_Id; // Check both URL params and request body for classId

	// If classId is not found in URL params or request body, handle accordingly
	if (!classId) {
		return res.status(400).json({ message: "Class ID is missing" });
	}

	const classToAccess = await Class.findByPk(classId);

	if (!classToAccess)
		return res.status(400).json({ message: "Class does not exist" });

	if (!(await classToAccess.hasUser(user))) {
		return res.status(401).json({ message: "User does not have access" });
	}

	next();
};

module.exports = checkClassAccess;
