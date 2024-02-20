const express = require("express");
const router = express.Router();

// Load each controller
// ex: const testController = require("./test.js") and test.js would have the controller routes/endpoints
const authController = require("./auth");

// Mount each controller under a specific route
router.use("/auth", authController);

module.exports = router;
