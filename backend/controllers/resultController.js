const Result = require("../models/Result");
const Quiz= require("../models/Quiz");
// Fetch all results with the relevant fields directly from the Result model
exports.getAllResults = async (req, res) => {
    try {
        const results = await Result.find();

        // Map through results and fetch the `quizName` for each result based on `quizId`
        const formattedResults = await Promise.all(
            results.map(async (result) => {
                const quiz = await Quiz.findOne({ quizId: result.quizId }); // Find quiz by `quizId`
                return {
                    username: result.username,
                    quizName: quiz ? quiz.quizName : "Exam", // Attach `quizName` if found, else null
                    score: result.score,
                    timeTaken: result.timeTaken,
                    status: result.status,
                    completedAt: result.completedAt,
                };
            })
        );

        res.json(formattedResults);
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({ message: "Failed to fetch results." });
    }
};

// Fetch result for a specific user by username
exports.getUserResult = async (req, res) => {
    try {
        const results = await Result.find({ username: req.params.userId });
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching user result:", error);
        res.status(500).json({ error: "Error fetching user result" });
    }
};

// Delete a result by its ID
exports.deleteResult = async (req, res) => {
    try {
        await Result.findByIdAndDelete(req.params.id); // Using findByIdAndDelete for simplicity
        res.status(200).json({ message: "Result deleted successfully" });
    } catch (error) {
        console.error("Error deleting result:", error);
        res.status(500).json({ error: "Error deleting result" });
    }
};
