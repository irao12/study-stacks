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

// router.put("/updateclass/:classId", async(req, res) => {
//     const classId = req.params.classId;
//     Class.findOne({
//         where: { Class_Id: classId, Owner_Id: req.user.User_Id }
//     })
//     .then((foundClass) => {
//         if (!foundClass) {
//             return res.status(404).json({ message: "Class not found" });
//         }

//         foundClass.update({
//             Name: req.body.content,
//         })
//         .then((updatedClass) => {
//             res.status(200).json(updatedClass);
//         })
//         .catch((error) => {
//             console.log(error);
//             res.status(400).json({ message: "Failed to update class" });
//         });
//     })
//     .catch((error) => {
//         console.log(error);
//         res.status(400).json({ message: "An error occurred while finding class" });
//     });
// });

router.post("/updateclass", (req, res) => {
	Class.update(
		{
			Name: req.body.Name,
		},
		{
			where: {
				Class_Id: req.body.Class_Id,
			},
		}
	)
		.then((tiles) => {
			res.status(201).json(tiles);
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json({ message: error.message });
		});
});


router.post("/deleteclass", (req, res) => {
	Class.destroy({
		where: {
			Class_Id: req.body.Class_Id,
		},
	})
		.then(() => {
			res.status(201).json({ message: "Class Deleted!" });
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json({ message: error.errors[0].message });
		});
});



module.exports = router;
