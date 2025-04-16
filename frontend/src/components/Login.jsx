import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated, setUsername, setIsAdmin, setQuizId }) => {
    const [username, setUsernameInput] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,
                { username, password }
            );

            if (response.status === 200) {
                const { token, isAdmin, username: returnedUsername, quizId } = response.data;

                localStorage.setItem("token", token);
                localStorage.setItem("username", returnedUsername);
                localStorage.setItem("isAdmin", isAdmin);

                setIsAuthenticated(true);
                setUsername(returnedUsername);
                setIsAdmin(isAdmin);

                if (!isAdmin && quizId) {
                    setQuizId(quizId);  // ✅ Pass quizId to parent
                }

                navigate("/");
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || "Login failed. Please try again."
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
                    label="Email ID"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
