// backend/models/Quiz.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    questionText: {
        type: String,
        required: true,
    },
    options: [
        {
            type: String,
            required: true,
        },
    ],
    correctAnswer: {
        type: String, // Index of the correct option (0, 1, 2, or 3)
        required: true,
    },
});

const quizSchema = new Schema({
    quizName: {
        type: String,
        unique: true,
        required: true,
    },
    quizId: {
        type: String,
        unique: true,
        required: true,
    },
    questions: [questionSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Quiz", quizSchema);
