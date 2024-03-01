const express = require("express");
const router = express.Router();

// Load each controller
// ex: const testController = require("./test.js") and test.js would have the controller routes/endpoints
const authController = require("./auth");
const setsController = require("./sets");

// Mount each controller under a specific route
router.use("/auth", authController);
router.use("/sets", setsController);

module.exports = router;
