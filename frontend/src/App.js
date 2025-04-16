import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Box, Button } from "@mui/material";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import QuizCreationForm from "./components/QuizCreationForm";
import QuizMain from "./components/QuizMain";
import PostTestScreen from "./components/PostTestScreen";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";
import Signup from "./components/Signup";
import axios from "axios";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
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
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/quiz/questions`,
          {
            params: { quizId },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const fetchedQuestions = response.data.map((q) => ({
          ...q,
          status: "grey",
        }));
        setQuestions(fetchedQuestions);

        const totalTime = fetchedQuestions.length * 60;
        setQuizDuration(totalTime);
        setRemainingTime(totalTime);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
      }
    };

    if (quizId && isAuthenticated && !isAdmin) {
      fetchQuestions();
    }

    if (isAdmin) {
      setLoading(false);
    }
  }, [quizId, isAuthenticated, isAdmin]);

  useEffect(() => {
    if (remainingTime > 0 && !quizCompleted) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (remainingTime === 0) {
      submitTest(true);
    }
  }, [remainingTime, quizCompleted]);

  const handleAnswerSelect = (selectedOption) => {
    const updatedQuestions = [...questions];
    const currentQuestion = updatedQuestions[currentQuestionIndex];

    if (currentQuestion.selectedOption === selectedOption) {
      currentQuestion.selectedOption = "";
      if (currentQuestion.status === "green") {
        setAnsweredCount((count) => count - 1);
        currentQuestion.status = "yellow";
      }
      if (currentQuestion.status === "indigo") {
        currentQuestion.status = "green";
      }
    } else {
      currentQuestion.selectedOption = selectedOption;
      if (currentQuestion.status !== "green" && currentQuestion.status !== "indigo") {
        setAnsweredCount((count) => count + 1);
      }
      currentQuestion.status = "green";
    }

    setQuestions(updatedQuestions);
    setSelectedAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = currentQuestion.selectedOption || "";
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
    const current = updatedQuestions[currentQuestionIndex];

    if (!current.selectedOption) {
      current.status = "yellow";
    }

    setQuestions(updatedQuestions);
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextQuestion = () => {
    const updatedQuestions = [...questions];
    const current = updatedQuestions[currentQuestionIndex];

    if (!current.selectedOption) {
      current.status = "yellow";
    }

    setQuestions(updatedQuestions);
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
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
      const confirmSubmit = window.confirm("Are you sure you want to submit the test?");
      if (!confirmSubmit) return;
    }

    if (!username) {
      console.error("Username is missing during submission.");
      return;
    }

    try {
      const timeTakenToComplete = quizDuration - remainingTime;
      setTimeTaken(timeTakenToComplete);

      const formattedAnswers = questions.map((q, index) => ({
        questionId: q._id,
        selectedOption: selectedAnswers[index] || "",
      }));

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/quiz/submit`,
        {
          username,
          quizId,
          answers: formattedAnswers,
          timeTaken: timeTakenToComplete,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }

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
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  if (!isAuthenticated) {
    return (
      <Login
        setIsAuthenticated={setIsAuthenticated}
        setUsername={setUsername}
        setQuizId={setQuizId}
        setIsAdmin={setIsAdmin}
      />
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (quizCompleted) {
    return <PostTestScreen score={score} timeTaken={formatTime(timeTaken)} />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          isAdmin ? (
            <AdminPanel />
          ) : (
            <>
              <Header Application_id={username} Test_id={quizId} />
              <Box sx={{ display: "flex", height: "100vh", mt: 8 }}>
                <Box sx={{ width: "30px", flexShrink: 0 }}>
                  <Sidebar
                    questions={questions}
                    navigateToQuestion={navigateToQuestion}
                    answeredCount={answeredCount}
                    remainingTime={formatTime(remainingTime)}
                  />
                </Box>
                <Box sx={{flexShrink: 0 }}>
                  <QuizMain
                    question={questions[currentQuestionIndex]?.questionText}
                    options={questions[currentQuestionIndex]?.options}
                    selectedOption={selectedAnswers[currentQuestionIndex] || ""}
                    handleOptionChange={(e) => handleAnswerSelect(e.target.value)}
                    handleMarkForReview={handleMarkForReview}
                    handlePrevious={handlePreviousQuestion}
                    handleNext={handleNextQuestion}
                    handleSubmit={() => submitTest()}
                  />
                </Box>
              </Box>
            </>
          )
        }
      />
    </Routes>
  );
}

export default App;

