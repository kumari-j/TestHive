const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const quizRoutes = require("./routes/quizRoutes");
const resultRoutes = require("./routes/resultRoutes"); // Import result routes
const authRoutes = require("./routes/authRoutes");
const path = require("path");


dotenv.config({ path: path.resolve(__dirname, "../.env") });


const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "https://testhive.onrender.com"],
    credentials: true,
}));
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
app.use(express.static(path.join(__dirname, "../frontend/build")))


// app.get("/", (req, res) => {
//     res.send("API is running...");
// });

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/build")));

    app.get(/^\/(?!api).*/, (_, res)=>{
    res.sendFile(path.resolve(__dirname,"../frontend","build","index.html"));
});
}
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
