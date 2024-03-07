const router = require("express").Router();
const { Classes: Classes } = require("../models");


router.post("/createclasses", (req, res) => {
	console.log("POST body: ", req.body);
	Classes.create({
		Class_Id: 0,
		Owner_Id: req.user.User_Id,
		Name: req.body.content,
	})
	.then(card => {
		res.status(201).json(card);
	})
	.catch((error) => {
		console.log(error);
		res.status(400).json({ message: error.errors[0].message });
	});
});

router.get("/viewclasses", (req, res) => {
    Classes.findAll({
        where: { Owner_Id: req.user.User_Id }
    })
    .then(classes => {
        res.status(200).json(classes);
    })
    .catch((error) => {
        console.log(error);
        res.status(400).json({ message: "An error occurred while fetching classes" });
    });
});

router.put("/updateclasses/:classId", (req, res) => {
    const classId = req.params.classId;
    Classes.findOne({
        where: { Class_Id: classId, Owner_Id: req.user.User_Id }
    })
    .then((foundClass) => {
        if (!foundClass) {
            return res.status(404).json({ message: "Class not found" });
        }

        foundClass.update({
            Name: req.body.content,
        })
        .then((updatedClass) => {
            res.status(200).json(updatedClass);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ message: "Failed to update class" });
        });
    })
    .catch((error) => {
        console.log(error);
        res.status(400).json({ message: "An error occurred while finding class" });
    });
});


router.delete("/deleteclasses/:classId", (req, res) => {
    const classId = req.params.classId;
    Classes.findOne({
        where: { Class_Id: classId, Owner_Id: req.user.User_Id }
    })
    .then((foundClass) => {
        if (!foundClass) {
            return res.status(404).json({ message: "Class not found" });
        }

        foundClass.destroy()
        .then(() => {
            res.status(200).json({ message: "Class deleted successfully" });
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ message: "Failed to delete class" });
        });
    })
    .catch((error) => {
        console.log(error);
        res.status(400).json({ message: "An error occurred while finding class" });
    });
});
