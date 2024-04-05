const router = require("express").Router();
const { Class } = require("../models");

router.post("/createclass", async (req, res) => {
	console.log("POST body: ", req.body);
	Class.create({
		Class_Id: 0,
		Owner_Id: req.user.User_Id,
		Name: req.body.content,
	})
		.then((card) => {
			res.status(201).json(card);
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json({
				message: "An error occurred while creating a class",
			});
		});
});

router.get("/viewclass", (req, res) => {
	Class.findAll({
		where: { Owner_Id: req.user.User_Id },
	})
		.then((classes) => {
			res.status(200).json(classes);
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json({
				message: "An error occurred while fetching classes",
			});
		});
});

router.put("/updateclass", (req, res) => {
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

router.delete("/deleteclass", (req, res) => {
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
