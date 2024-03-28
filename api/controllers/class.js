const router = require("express").Router();
const { Class } = require("../models");

router.post("/createclass", async(req, res) => {
	console.log("POST body: ", req.body);
	Class.create({
		Class_Id: 0,
		Owner_Id: req.user.User_Id,
		Name: req.body.content,
	})
	.then(card => {
		res.status(201).json(card);
	})
	.catch((error) => {
		console.log(error);
		res.status(400).json({message: "An error occurred while fetching classes"  });
	});
});

// router.post("/createclass", async (req, res) => {
//     try {
//         console.log("POST body: ", req.body);
//         const createdClass = await Class.create({
//             Class_Id: 0,
//             Owner_Id: 0, // Set Owner_Id to 0
//             Name: req.body.content,
//         });
//         res.status(201).json(createdClass);
//     } catch (error) {
//         if (error.name === 'SequelizeForeignKeyConstraintError') {
//             res.status(400).json({ message: "Cannot create class without a valid term." });
//         } else {
//             console.error(error);
//             res.status(500).json({ message: "An unexpected error occurred." });
//         }
//     }
// });


router.get("/viewclass", (req, res) => {
    Class.findAll({
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

router.put("/updateclass/:classId", (req, res) => {
    const classId = req.params.classId;
    Class.findOne({
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


router.delete("/deleteclass/:classId", (req, res) => {
    const classId = req.params.classId;
    Class.findOne({
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

module.exports = router;
