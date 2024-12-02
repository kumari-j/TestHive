// backend/routes/quizRoutes.js

const express = require("express");
const router = express.Router();
const Result = require("../models/Result");
const Quiz = require("../models/Quiz");

// Helper function to create a unique quiz ID from the quiz name
const generateQuizId = (quizName) => {
    return quizName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
};

/// Route to fetch all quiz questions based on quizId
router.get("/questions", async (req, res) => {
    try {
        const { quizId } = req.query; // Get quizId from query params
        if (!quizId) {
            return res.status(400).json({ message: "Quiz ID is required" });
        }

        // Find the quiz by quizId
        const quiz = await Quiz.findOne({ quizId });
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Send back the questions from the found quiz
        res.json(quiz.questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ message: "Error fetching questions" });
    }
});


// Route to submit answers and calculate the score
router.post("/submit", async (req, res) => {
    const { username, quizId, answers, timeTaken } = req.body;
    console.log("Bkend"+timeTaken);
    
    // Validate required fields
    if (
        !username ||
        !quizId ||
        !Array.isArray(answers) ||
        answers.length === 0
    ) {
        return res.status(400).json({ message: "Invalid request data" });
    }

    let score = 0;
    const resultAnswers = [];

    try {
        // Find the quiz by quizId and retrieve its questions
        const quiz = await Quiz.findOne({ quizId });

        // If quiz not found, return an error
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Loop through each answer provided by the user
        answers.forEach((answer) => {
            // Find the question in the quiz's questions array
            const question = quiz.questions.find(
                (q) => q._id.toString() === answer.questionId
            );

            // Check if the answer is correct
            const isCorrect =
                question && answer.selectedOption === question.correctAnswer;
            if (isCorrect) score += 1;

            // Push the answer details to resultAnswers
            resultAnswers.push({
                questionId: answer.questionId,
                selectedOption: answer.selectedOption,
                isCorrect: !!isCorrect,
            });
        });

        // Create a new Result document
        const result = new Result({
            username,
            quizId,
            score,
            timeTaken,
            answers: resultAnswers,
            completedAt: new Date(),
        });

        // Save the result document
        await result.save();

        // Return the result and score to the client
        res.status(200).json({ score, result });
    } catch (error) {
        console.error("Error submitting answers:", error);
        res.status(500).json({ message: "Error submitting answers" });
    }
});

// Route to add a new quiz
router.post("/addQuiz", async (req, res) => {
    const { quizName, questions } = req.body;

    try {
        const existingQuiz = await Quiz.findOne({ quizName });

        if (existingQuiz) {
            return res
                .status(400)
                .json({ message: "Quiz with this name already exists." });
        }
        
        // Validate questions array
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                message: "Questions array is required and cannot be empty.",
            });
        }

        // Validate each question in the array
        for (const question of questions) {
            if (
                !question.questionText ||
                question.options.length !== 4 ||
                typeof question.correctAnswer !== "string"
            ) {
                return res.status(400).json({
                    message:
                        "Each question must have 'questionText', exactly 4 'options', and a 'correctAnswer' field.",
                });
            }
        }

        const quizId = generateQuizId(quizName);
        const newQuiz = new Quiz({
            quizName,
            quizId,
            questions,
        });

        await newQuiz.save();

        res.status(201).json({
            message: "Quiz created successfully!",
            quizId: newQuiz.quizId,
        });
    } catch (error) {
        console.error("Error creating quiz:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
