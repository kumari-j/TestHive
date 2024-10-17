import React, { useState, useEffect } from "react";
import { Container, Box, Button } from "@mui/material"; // Import necessary components from MUI
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import QuizMain from "./components/QuizMain";
import PostTestScreen from "./components/PostTestScreen";
import axios from "axios";
import "./App.css";

function App() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [quizDuration, setQuizDuration] = useState(600);
    const [remainingTime, setRemainingTime] = useState(600);
    const [loading, setLoading] = useState(true);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [score, setScore] = useState(null);
    const [timeTaken, setTimeTaken] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]); // Added state for selected answers

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/quiz/questions`
                );
                const fetchedQuestions = response.data.map((q) => ({
                    ...q,
                    status: "grey", // Initial status
                }));
                setQuestions(fetchedQuestions);
                const durationInMinutes = 10;
                const durationInSeconds = durationInMinutes * 60;
                setQuizDuration(durationInSeconds);
                setRemainingTime(durationInSeconds);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching quiz questions:", error);
            }
        };

        fetchQuestions();
    }, []);

    useEffect(() => {
        if (remainingTime > 0 && !quizCompleted) {
            const timer = setInterval(() => {
                setRemainingTime((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearInterval(timer);
        } else if (remainingTime === 0) {
            submitTest(true); // Auto-submit without prompt when time is up
        }
    }, [remainingTime, quizCompleted]);


    const handleAnswerSelect = (selectedOption) => {
        let updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].selectedOption = selectedOption;
        if (updatedQuestions[currentQuestionIndex].status !== "green") {
            updatedQuestions[currentQuestionIndex].status = "green";
            setAnsweredCount(answeredCount + 1);
        }
        setQuestions(updatedQuestions);

        // Update selected answers state
        setSelectedAnswers((prev) => {
            const newAnswers = [...prev];
            newAnswers[currentQuestionIndex] = selectedOption; // Save answer for the current question
            return newAnswers;
        });
    };

    const handleMarkForReview = () => {
        let updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].status = "indigo";
        setQuestions(updatedQuestions);
    };

    const handlePreviousQuestion = () => {
        // Mark the current question as unanswered if it has not been answered
        let updatedQuestions = [...questions];
        if (!updatedQuestions[currentQuestionIndex].selectedOption) {
            updatedQuestions[currentQuestionIndex].status = "red"; // Mark as unanswered
        }
        setQuestions(updatedQuestions);

        // Navigate to the previous question
        setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleNextQuestion = () => {
        // Mark the current question as unanswered if it has not been answered
        let updatedQuestions = [...questions];
        if (!updatedQuestions[currentQuestionIndex].selectedOption) {
            updatedQuestions[currentQuestionIndex].status = "red"; // Mark as unanswered
        }
        setQuestions(updatedQuestions);

        // Navigate to the next question
        setCurrentQuestionIndex((prevIndex) =>
            Math.min(prevIndex + 1, questions.length - 1)
        );
    };

    const navigateToQuestion = (index) => {
        let updatedQuestions = [...questions];
        if (updatedQuestions[index].status === "grey") {
            updatedQuestions[index].status = "yellow"; // Change to yellow when navigating back
        }
        setQuestions(updatedQuestions);
        setCurrentQuestionIndex(index);
    };

    const submitTest = async (isTimeUp = false) => {
        // Only show the prompt if it's not an automatic submission due to time running out
        if (!isTimeUp) {
            const confirmSubmit = window.confirm(
                "Are you sure you want to submit the test?"
            );

            if (!confirmSubmit) {
                return; // If user cancels, exit the function.
            }
        }

        try {
            const timeTakenToComplete = quizDuration - remainingTime;
            setTimeTaken(timeTakenToComplete);

            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/quiz/submit`,
                {
                    answers: questions.map((q) => ({
                        questionText: q.questionText,
                        selectedOption: q.selectedOption,
                        correctOption: q.correctOption,
                    })),
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
                        question={questions[currentQuestionIndex]?.questionText}
                        options={questions[currentQuestionIndex]?.options}
                        selectedOption={
                            selectedAnswers[currentQuestionIndex] || ""
                        }
                        onAnswerSelect={handleAnswerSelect}
                        onMarkForReview={handleMarkForReview}
                        onPreviousQuestion={handlePreviousQuestion}
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
                            onClick={() => submitTest()} // Manual submission, no "isTimeUp" argument
                            sx={{ mt: 3 }} // Adds margin-top
                        >
                            Submit Test
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}

export default App;


/*
test resumtion after power off 
dynamic scoring
admin panel
okkay many bugs are there 
1. on asking permission even if user denies the permission the test start in a normal window which simply defeats the purpose instead the test should not start with appopriate dialog like to start the test only option is to enter full screen
2. if i swipe with three fingers on my laptop or do any such fancy stuff test of switching window or tab or anything which makes me go out of fullscreen test....prompt have to come for alert of exiting fullscreen and test over if not reverted
3. suppose i press esc and prompt comes then on clicking continue in fullscreen prompt should vanish and test should resume again whhile currently it just hangs there
4. on clicking on submit test button the test should remain in full screen only it is currently shited to non-full screen when accidental submission prompt comes
*/