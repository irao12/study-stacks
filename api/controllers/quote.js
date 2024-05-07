const router = require("express").Router();

router.get("/", (req, res) => {
	res.send("this is a quote");
});

module.exports = router;
