const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// Route to fetch all quiz questions
router.get("/questions", async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to submit answers
// Route to submit answers
router.post("/submit", (req, res) => {
    const { answers } = req.body; // Expecting { answers: { questionId: selectedOption } }

    // Sample scoring logic (this is just a placeholder, expand as needed)
    let score = 0;

    // Logic to calculate score (match submitted answers with correctOption)
    answers.forEach((answer) => {
        // Assuming questions are already fetched and available
        if (answer.selectedOption === answer.correctOption) {
            score += 1;
        }
    });

    res.json({ score });
});
module.exports = router;
