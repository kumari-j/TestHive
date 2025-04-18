// /frontend/src/components/QuizCreation.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

const QuizCreationForm = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [quizName, setQuizName] = useState("");
    const [questions, setQuestions] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [startDate, setStartDate] = useState("");
    const [totalMarks, setTotalMarks] = useState("");
    const [negativeMarking, setNegativeMarking] = useState("");
    const [duration, setDuration] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            setLoadingStudents(true);
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/users/students`
                );
                setStudents(res.data);
            } catch (err) {
                console.error("Failed to fetch students:", err);
            } finally {
                setLoadingStudents(false);
            }
        };

        fetchStudents();
    }, []);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
        ]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");

        console.log(questions);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/quiz/addQuiz`,
                {
                    quizName,
                    questions,
                    allowedStudents: selectedStudents.map((student) => student._id),
                    startDate,
                    totalMarks,
                    negativeMarking,
                    totalDuration: duration,
                }
            );

            if (response.status === 201) {
                setMessage(
                    `Quiz created successfully! Quiz ID: ${response.data.quizId}`
                );
                setQuizName("");
                setQuestions([]);
            }
        } catch (err) {
            console.error("Error creating quiz:", err);
            setError(
                err.response?.data?.message ||
                    "Failed to create quiz. Please try again."
            );
        }
    };

    const handleQuizNameChange = (event) => {
        setQuizName(event.target.value);
    };

    const handleQuestionChange = (index, field, value) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question, i) =>
                i === index ? { ...question, [field]: value || "" } : question
            )
        );
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = questions.map((question, i) =>
            i === questionIndex
                ? {
                      ...question,
                      options: question.options.map((option, j) =>
                          j === optionIndex ? value : option
                      ),
                  }
                : question
        );
        setQuestions(updatedQuestions);
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    return (
        <Box sx={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
            <Paper elevation={3} sx={{ padding: "20px" }}>
                <Typography variant="h4" gutterBottom>
                    Exam Creation Form
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Exam Name"
                        value={quizName}
                        onChange={handleQuizNameChange}
                        fullWidth
                        required
                        margin="normal"
                    />

                    <TextField
                        label="Start Date"
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <TextField
                        label="Total Marks"
                        type="number"
                        value={totalMarks}
                        onChange={(e) => setTotalMarks(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />

                    <TextField
                        label="Negative Marking (per question)"
                        type="number"
                        value={negativeMarking}
                        onChange={(e) => setNegativeMarking(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Duration (minutes)"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />

                    {questions.map((question, qIndex) => (
                        <Box
                            key={qIndex}
                            sx={{
                                marginTop: "20px",
                                padding: "15px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                            }}
                        >
                            <TextField
                                label={`Question ${qIndex + 1}`}
                                value={question.questionText}
                                onChange={(e) =>
                                    handleQuestionChange(
                                        qIndex,
                                        "questionText",
                                        e.target.value
                                    )
                                }
                                fullWidth
                                required
                                margin="normal"
                            />

                            {question.options.map((option, oIndex) => (
                                <TextField
                                    key={oIndex}
                                    label={`Option ${oIndex + 1}`}
                                    value={option}
                                    onChange={(e) =>
                                        handleOptionChange(
                                            qIndex,
                                            oIndex,
                                            e.target.value
                                        )
                                    }
                                    fullWidth
                                    required
                                    margin="normal"
                                />
                            ))}

                            <TextField
                                label="Correct Answer (Enter Option Number)"
                                value={question.correctAnswer}
                                onChange={(e) =>
                                    handleQuestionChange(
                                        qIndex,
                                        "correctAnswer",
                                        e.target.value
                                    )
                                }
                                fullWidth
                                required
                                margin="normal"
                            />

                            <IconButton
                                onClick={() => removeQuestion(qIndex)}
                                color="error"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}

                    <Button
                        variant="outlined"
                        onClick={addQuestion}
                        sx={{ marginTop: "20px" }}
                    >
                        Add Question
                    </Button>

                    <Autocomplete
                        multiple
                        options={students}
                        getOptionLabel={(option) => option.username}
                        value={selectedStudents}
                        onChange={(event, newValue) => setSelectedStudents(newValue)}
                        loading={loadingStudents}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Students"
                                placeholder="Choose students to assign quiz"
                                margin="normal"
                            />
                        )}
                        sx={{ marginTop: "20px" }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: "20px", marginLeft: "10px" }}
                    >
                        Submit Exam
                    </Button>

                    {message && (
                        <Typography color="green" sx={{ marginTop: "10px" }}>
                            {message}
                        </Typography>
                    )}
                    {error && (
                        <Typography color="red" sx={{ marginTop: "10px" }}>
                            {error}
                        </Typography>
                    )}
                </form>
            </Paper>
        </Box>
    );
};

export default QuizCreationForm;
