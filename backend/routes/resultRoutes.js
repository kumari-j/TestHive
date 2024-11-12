const express = require("express");
const {
    getAllResults,
    getUserResult,
    deleteResult,
} = require("../controllers/resultController"); // Import result controller functions

const router = express.Router();

// Route to get all results (Admin)
router.get("/", getAllResults);

// Route to get a specific user's result
router.get("/:userId", getUserResult);

// Route to delete a result by its ID (Admin)
router.delete("/:id", deleteResult);

module.exports = router;
