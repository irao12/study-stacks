const router = require("express").Router();
const { User: User } = require("../models");
const passport = require("../middlewares/authentication");
const jwt = require("jsonwebtoken");

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
			const token = jwt.sign(
				{
					data: user,
				},
				process.env.SESSION_SECRET,
				{
					expiresIn: "24h",
				}
			);
			req.login(user, () =>
				res.status(201).json({ user: user, token: token })
			);
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
	const token = jwt.sign(
		{
			data: req.user,
		},
		process.env.SESSION_SECRET,
		{
			expiresIn: "24h",
		}
	);

	res.json({ user: req.user, token: token });
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
