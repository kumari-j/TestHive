import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Paper,
} from "@mui/material";
import axios from "axios";

const QuizMain = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("/api/questions");
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption(""); // Optional: reset option
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(""); // Optional: reset option
    }
  };

  const handleMarkForReview = () => {
    // Add review logic
    console.log("Marked for review:", currentIndex);
  };

  const handleSubmit = () => {
    // Submit logic
    console.log("Submitting test...");
  };

  if (questions.length === 0) return <div>Loading...</div>;

  const currentQuestion = questions[currentIndex];
  const { question, options } = currentQuestion;

  return (
    <Paper elevation={2} sx={{ height: "100vh", display: "flex", flexDirection: "column", p: 3 }}>
      {/* Question Number */}
      <Typography variant="h6" mb={2}>
        Question {currentIndex + 1} of {questions.length}
      </Typography>

      {/* Question & Options with Divider */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 4,
          flexGrow: 1,
          overflowY: "auto",
          pb: 10, // padding bottom to prevent hiding behind footer
        }}
      >
        {/* Question */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {question}
          </Typography>
        </Box>

        {/* Divider */}
        <Box
          sx={{
            width: "1px",
            bgcolor: "#ccc",
            mx: 1,
            height: "100%",
          }}
        />

        {/* Options */}
        <Box sx={{ flex: 2 }}>
          <FormControl component="fieldset">
            <RadioGroup value={selectedOption} onChange={handleOptionChange}>
              {options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={index + 1}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>

      {/* Fixed Bottom Navigation */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          bgcolor: "#f5f5f5",
          py: 1,
          px: 2,
          borderTop: "1px solid #ccc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <Button variant="contained" color="error" onClick={handleSubmit}>
          Submit Test
        </Button>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" onClick={handlePrevious}>
            Previous
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleMarkForReview}>
            Mark for Review
          </Button>
          <Button variant="outlined" onClick={handleNext}>
            Next
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default QuizMain;
