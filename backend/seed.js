const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Question = require("./models/Question");

dotenv.config();

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected for seeding"))
    .catch((err) => console.log(err));

const questions = [
    {
        questionText: "What is 3+2?",
        options: ["2", "3", "4", "5"],
        correctOption: "5",
    },
    {
        questionText: "What is the capital of India?",
        options: ["Paris", "London", "Delhi", "Rome"],
        correctOption: "Delhi",
    },
];

const seedDB = async () => {
    await Question.deleteMany(); // Clear existing questions
    await Question.insertMany(questions); // Insert sample questions
    console.log("Database seeded!");
    mongoose.connection.close();
};

seedDB();
