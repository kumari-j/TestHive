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
        type: String,
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
    allowedStudents: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
]
,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Quiz", quizSchema);
