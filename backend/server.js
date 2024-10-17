const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const quizRoutes = require("./routes/quizRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// Use routes
app.use("/api/quiz", quizRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

