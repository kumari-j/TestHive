import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";

const PostTestScreen = ({ score, timeTaken}) => {
    
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 5,
            }}
        >
            <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
                <Typography variant="h4" gutterBottom>
                    Quiz Completed!
                </Typography>
                <Typography variant="h6">Your Score: {score}</Typography>
                <Typography variant="body1">Time Taken: {timeTaken}</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }} // Adds margin-top
                    onClick={() => window.location.reload()} // Reload to restart the quiz
                >
                    Restart Quiz
                </Button>
            </Paper>
        </Box>
    );
};

export default PostTestScreen;
