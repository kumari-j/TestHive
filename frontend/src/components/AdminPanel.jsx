import React, { useState, useEffect } from "react";
import {
    Container,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    CircularProgress,
} from "@mui/material";
import axios from "axios";
import QuizCreationForm from "./QuizCreationForm"; // Importing the QuizCreationForm component

const AdminPanel = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes} min ${seconds} sec`;
    };

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/results`
                );
                setResults(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching results:", error);
            }
        };
        fetchResults();
        console.log(results);
        
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Admin Panel - Student Results
                </Typography>

                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 4,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Quiz Title</TableCell>
                                    <TableCell>Score</TableCell>
                                    <TableCell>Time Taken (seconds)</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Date Completed</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {results.map((result) => (
                                    <TableRow key={result._id}>
                                        <TableCell>{result.username}</TableCell>
                                        <TableCell>
                                            {result.quizName}
                                        </TableCell>
                                        <TableCell>{result.score}</TableCell>
                                        <TableCell>
                                            {formatTime(result.timeTaken)}
                                        </TableCell>
                                        <TableCell>{result.status}</TableCell>
                                        <TableCell>
                                            {new Date(
                                                result.completedAt
                                            ).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Quiz Creation Form Section */}
                <Box sx={{ mt: 5 }}>
                    <Typography variant="h4" gutterBottom>
                        Create a New Quiz
                    </Typography>
                    <QuizCreationForm />
                </Box>
            </Box>
        </Container>
    );
};

const handleReview = (studentId) => {
    // Logic to review the student's flagged session
    alert(`Reviewing student with ID: ${studentId}`);
};

export default AdminPanel;
