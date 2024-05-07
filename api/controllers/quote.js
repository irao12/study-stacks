const router = require("express").Router();

// url: /api/quote
router.get("/", async (req, res) => {
	const url = 'https://api.quotable.io/quotes/random?tags=success|inspirational';
	const fetchResult = await fetch(url);

	if (!fetchResult.ok) {
		res.status(500);
		return;
	}

	const quoteData = (await fetchResult.json())[0];
	res.json({content: quoteData.content, author: quoteData.author});
});

module.exports = router;
