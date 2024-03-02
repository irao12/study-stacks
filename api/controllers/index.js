const express = require("express");
const router = express.Router();

// Load each controller
// ex: const testController = require("./test.js") and test.js would have the controller routes/endpoints
const authController = require("./auth");
const cardsController = require("./cards");

// Mount each controller under a specific route
router.use("/auth", authController);
router.use("/cards", cardsController);

module.exports = router;
