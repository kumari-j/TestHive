// backend/models/Result.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resultSchema = new Schema({
    username: {
        type: String,
        ref: "User",
        required: true,
    },
    quizId: {
        type: String,
        ref: "Quiz",
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    answers: [
        {
            questionId: {
                type: Schema.Types.ObjectId,
                ref: "Question",
                required: true,
            },
            selectedOption: {
                type: String,
                required: true,
            },
            isCorrect: {
                type: Boolean,
                required: true,
            },
        },
    ],
    timeTaken: {
        type: Number,
        required: true,
    },
    completedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["completed", "flagged", "incomplete"],
        default: "completed",
    },
});

module.exports = mongoose.model("Result", resultSchema);
