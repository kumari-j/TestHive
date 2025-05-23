// backend/routes/authRoutes.js

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Quiz = require("../models/Quiz"); // Assuming Quiz model contains quiz IDs
const router = express.Router();

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Route for user signup
router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
   
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user
        try {
            const newUser = new User({
                username,
                password: hashedPassword,
                isAdmin: false,
            });
            await newUser.save();
        } catch (err) {
            res.status(500).json({ message: err.message })
        }

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error during signup" });
    }
});

// Route for login
// Route for login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid user" });
        }

        // Check if the user is an admin
        if (user.isAdmin) {
            const adminToken = jwt.sign(
                { userId: user._id, isAdmin: true },
                JWT_SECRET,
                { expiresIn: "4h" }
            );
            return res.status(200).json({
                token: adminToken,
                isAdmin: true,
                username: user.username,
            });
        }

        // Compare password (keeping plain-text for now as per your original)
        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Find the quiz assigned to this student
        const quiz = await Quiz.findOne({ allowedStudents: user._id });
        if (!quiz) {
            return res.status(403).json({ message: "No quiz assigned to this student." });
        }

        // Generate JWT token for a regular user
        const token = jwt.sign(
            { userId: user._id, quizId: quiz.quizId, isAdmin: false },
            JWT_SECRET,
            { expiresIn: "4h" }
        );

        res.status(200).json({
            token,
            isAdmin: false,
            username: user.username,
            quizId: quiz.quizId, // Include this to use in frontend
        });

    } catch (error) {
        res.status(500).json({ message: "Server error during login" });
    }
});




module.exports = router;
