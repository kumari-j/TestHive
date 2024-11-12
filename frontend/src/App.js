import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Container, Box, Button } from "@mui/material";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import QuizMain from "./components/QuizMain";
import PostTestScreen from "./components/PostTestScreen";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";
import Signup from "./components/Signup";
import axios from "axios";
import "./App.css";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState(null); // Updated from userId to username
    const [quizId, setQuizId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [quizDuration, setQuizDuration] = useState(600);
    const [remainingTime, setRemainingTime] = useState(600);
    const [loading, setLoading] = useState(true);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [score, setScore] = useState(null);
    const [timeTaken, setTimeTaken] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/quiz/questions`,
                { params: { quizId } }
            );
            const fetchedQuestions = response.data.map((q) => ({
                ...q,
                status: "grey",
            }));

            setQuestions(fetchedQuestions);

            // Calculate total quiz time (60 seconds per question)
            const totalTime = fetchedQuestions.length * 60;
            setQuizDuration(totalTime); // Set total time
            setRemainingTime(totalTime); // Set remaining time for the entire quiz
            setLoading(false);
        } catch (error) {
            console.error("Error fetching quiz questions:", error);
        }
    };

    if (quizId && isAuthenticated&&!isAdmin) {
        console.log("App.js - Current username after login:", username);
        fetchQuestions();
    }
        if (isAdmin)
        {
            setLoading(false);
        }
}, [quizId, isAuthenticated,isAdmin]);

useEffect(() => {
    // Start the countdown timer for the entire quiz once the quiz has started
    if (remainingTime > 0 && !quizCompleted) {
        const timer = setInterval(() => {
            setRemainingTime((prevTime) => prevTime - 1); // Decrease remaining time by 1 second
        }, 1000);

        return () => clearInterval(timer); // Cleanup timer on component unmount or if time is up
    } else if (remainingTime === 0) {
        // Time's up, auto-submit the test
        submitTest(true);
    }
}, [remainingTime, quizCompleted]); 

    const handleAnswerSelect = (selectedOption) => {
        const updatedQuestions = [...questions];
        const currentQuestion = updatedQuestions[currentQuestionIndex];

        if (currentQuestion.selectedOption === selectedOption) {
            currentQuestion.selectedOption = "";
            if (currentQuestion.status === "green") {
                setAnsweredCount(answeredCount - 1);
                currentQuestion.status = "yellow";
            }
            if (currentQuestion.status === "indigo")
            {
                currentQuestion.status = "green";
            }
        }else {
            currentQuestion.selectedOption = selectedOption;
            if (currentQuestion.status !== "green"&& currentQuestion.status !== "indigo") {
                setAnsweredCount(answeredCount + 1);
            }
            currentQuestion.status = "green";
            
        }

        setQuestions(updatedQuestions);
        setSelectedAnswers((prev) => {
            const newAnswers = [...prev];
            newAnswers[currentQuestionIndex] =
                currentQuestion.selectedOption || "";
            return newAnswers;
        });
    };

    const handleMarkForReview = () => {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].status = "indigo";
        setQuestions(updatedQuestions);
    };

    const handlePreviousQuestion = () => {
        const updatedQuestions = [...questions];
        if (!updatedQuestions[currentQuestionIndex].selectedOption) {
            updatedQuestions[currentQuestionIndex].status = "red";
        }
        setQuestions(updatedQuestions);
        setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleNextQuestion = () => {
        const updatedQuestions = [...questions];
        if (!updatedQuestions[currentQuestionIndex].selectedOption) {
            updatedQuestions[currentQuestionIndex].status = "red";
        }
        setQuestions(updatedQuestions);
        setCurrentQuestionIndex((prevIndex) =>
            Math.min(prevIndex + 1, questions.length - 1)
        );
    };

    const navigateToQuestion = (index) => {
        const updatedQuestions = [...questions];
        if (updatedQuestions[index].status === "grey") {
            updatedQuestions[index].status = "yellow";
        }
        setQuestions(updatedQuestions);
        setCurrentQuestionIndex(index);
    };

    const submitTest = async (isTimeUp = false) => {
        if (!isTimeUp) {
            const confirmSubmit = window.confirm(
                "Are you sure you want to submit the test?"
            );
            if (!confirmSubmit) {
                return;
            }
        }
        if (!username) {
            console.error("Error: username is missing during submission.");
            return; // Avoid submitting without userId
        }

        try {
            const timeTakenToComplete = quizDuration - remainingTime;
            setTimeTaken(timeTakenToComplete);

            const formattedAnswers = questions.map((q) => ({
                questionId: q._id,
                selectedOption: q.selectedOption,
            }));

            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/quiz/submit`,
                {
                    username: username, 
                    quizId: quizId,
                    answers: formattedAnswers,
                    timeTaken: timeTaken,
                }
            );
            setScore(response.data.score);
            setQuizCompleted(true);
        } catch (error) {
            console.error("Error submitting quiz:", error);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${
            remainingSeconds < 10 ? "0" : ""
        }${remainingSeconds}`;
    };

    if (!isAuthenticated) {
        return (
            <Container maxWidth="sm">
                <Login
                    setIsAuthenticated={setIsAuthenticated}
                    setUsername={setUsername} // Updated from setUserId to setUsername
                    setQuizId={setQuizId}
                    setIsAdmin={setIsAdmin}
                />
                <Signup />
            </Container>
        );
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (quizCompleted) {
        return (
            <PostTestScreen score={score} timeTaken={formatTime(timeTaken)} />
        );
    }

    return (
        <Container maxWidth="lg">
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/"
                    element={
                        isAdmin ? (
                            <AdminPanel />
                        ) : (
                            <>
                                <Header
                                    quizTitle="Sample Quiz"
                                    answeredCount={answeredCount}
                                    remainingTime={formatTime(remainingTime)}
                                />
                                <Box sx={{ display: "flex", mt: 8 }}>
                                    <Sidebar
                                        questions={questions}
                                        navigateToQuestion={navigateToQuestion}
                                    />
                                    <Box sx={{ flexGrow: 1, ml: 2 }}>
                                        <QuizMain
                                            question={
                                                questions[currentQuestionIndex]
                                                    ?.questionText
                                            }
                                            options={
                                                questions[currentQuestionIndex]
                                                    ?.options
                                            }
                                            selectedOption={
                                                selectedAnswers[
                                                    currentQuestionIndex
                                                ] || ""
                                            }
                                            onAnswerSelect={handleAnswerSelect}
                                            onMarkForReview={
                                                handleMarkForReview
                                            }
                                            onPreviousQuestion={
                                                handlePreviousQuestion
                                            }
                                            onNextQuestion={handleNextQuestion}
                                        />
                                        <Box
                                            sx={{
                                                mt: 2,
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() =>submitTest()}
                                                sx={{ mt: 3 }}
                                            >
                                                Submit Test
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </>
                        )
                    }
                />
            </Routes>
        </Container>
    );
}

export default App;
