const express = require("express");
const router = express.Router();

// Load each controller
// ex: const testController = require("./test.js") and test.js would have the controller routes/endpoints
const authController = require("./auth");
const setController = require("./set");
const classController = require("./class");
const cardsController = require("./flashcard");
const termController = require("./term");
const quoteController = require("./quote");

// Mount each controller under a specific route
router.use("/class", classController);
router.use("/auth", authController);
router.use("/set", setController);
router.use("/flashcard", cardsController);
router.use("/term", termController);
router.use("/quote", quoteController);

module.exports = router;
