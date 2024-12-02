import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated, setUsername, setQuizId, setIsAdmin }) => {
    const [username, setUsernameInput] = useState(""); // use setUsernameInput to handle form input
    const [password, setPassword] = useState("");
    const [quizId, setQuizIdInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        console.log(username, password,quizId);
        
        try {
            // Make login request to backend
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,
                { username, password, quizId }
            );

            if (response.status === 200) {
                const { token, isAdmin, username } = response.data;

                // Save session data to local storage
                localStorage.setItem("token", token);
                localStorage.setItem("username", username); // store username, not userId
                localStorage.setItem("quizId", quizId);
                localStorage.setItem("isAdmin", isAdmin);

                console.log("Setting username:", username);
                // Update session state
                setIsAuthenticated(true);
                setUsername(username); // update with username directly
                setQuizId(quizId);
                setIsAdmin(isAdmin);
                
                // Redirect based on role
                navigate("/");
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                    "Login failed. Please try again."
            );
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
               TestHive - Login
            </Typography>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <form onSubmit={handleLogin}>
                <TextField
                    label="Application ID"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    required
                />
                <TextField
                    label="Date of Birth"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <TextField
                    label="Exam ID"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={quizId}
                    onChange={(e) => setQuizIdInput(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                   Login
                </Button>
            </form>
        </Box>
    );
};

export default Login;
