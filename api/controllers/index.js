const express = require("express");
const router = express.Router();

// Load each controller
// ex: const testController = require("./test.js") and test.js would have the controller routes/endpoints
const authController = require("./auth");
const setController = require("./set");

// Mount each controller under a specific route
router.use("/auth", authController);
router.use("/set", setController);

module.exports = router;
