const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const quizRoutes = require("./routes/quizRoutes");
const resultRoutes = require("./routes/resultRoutes"); // Import result routes
const authRoutes = require("./routes/authRoutes");

// Explicitly load the `.env` file relative to the backend folder
dotenv.config({ path: require("path").resolve(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

// Use routes
app.use("/api/quiz", quizRoutes);
app.use("/api/results", resultRoutes); // Use result routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
