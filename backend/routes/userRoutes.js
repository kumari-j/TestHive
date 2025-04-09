// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET all students (non-admin users)
router.get('/students', async (req, res) => {
    try {
        const students = await User.find({ isAdmin: false });
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
