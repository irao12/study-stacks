const router = require("express").Router();
const { User: User } = require("../models");
const passport = require("../middlewares/authentication");

// url: /api/auth/signup
router.post("/signup", (req, res) => {
	console.log("POST body: ", req.body);
	User.create({
		First_Name: req.body.firstName,
		Last_Name: req.body.lastName,
		Email: req.body.email,
		Password: req.body.password,
	})
		.then((user) => {
			//save user to database.
			req.login(user, () => res.status(201).json(user));
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json({ message: error.errors[0].message });
		});
});

// url: /api/auth/login
router.post("/login", passport.authenticate("local"), (req, res) => {
	//if this function gets called, authentication was successful.
	// `req.user` contains the authenticated user.
	res.json(req.user);
});

// url: /api/auth/login
router.get("/login", (req, res) => {
	if (req.user) {
		res.json(req.user);
	} else {
		res.sendStatus(401);
	}
});

router.post("/logout", (req, res, next) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.status(200).json({ message: "logged out successfully!" });
	});
});

module.exports = router;
