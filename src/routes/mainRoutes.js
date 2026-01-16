const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const userCompletionRoutes = require("./userCompletionRoutes");
const wellnessChallengeRoutes = require("./wellnessChallengeRoutes");
const cityRoutes = require("./cityRoutes");
const armyRoutes = require("./armyRoutes");
const battleRoutes = require("./battleRoutes");
const diplomacyRequestRoutes = require("./diplomacyRequestRoutes");
const diplomacyRoutes = require("./diplomacyRoutes");
const authRoutes = require("./authRoutes")

router.use("/users", userRoutes);
router.use("/userCompletions", userCompletionRoutes);
router.use("/challenges", wellnessChallengeRoutes);
router.use("/cities", cityRoutes);
router.use("/armies", armyRoutes);
router.use("/diplomacyRequests", diplomacyRequestRoutes);
router.use("/diplomacies", diplomacyRoutes);
router.use("/battles", battleRoutes);
router.use("/auth", authRoutes)

module.exports = router;
