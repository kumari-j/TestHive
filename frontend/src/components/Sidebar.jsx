import React from "react";
import { Box, Typography, Paper } from "@mui/material";

function Sidebar({ questions, navigateToQuestion, answeredCount, remainingTime }) {
    return (
        <Box
            sx={{
                display: "flex",
                position: "fixed",
                right: 18,
                top: 60,
                width: "70%",
                height: "auto",
                flexDirection: "column",
                alignItems: "flex-end",
            }}
        >
            {/* Answered and Timer Card */}
            <Paper
                elevation={4}
                sx={{
                    width: 220,
                    padding: 2,
                    borderRadius: "8px",
                    mb: 2
                }}
            >
                <Typography variant="h6" align="center" gutterBottom>
                    Status
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body1">Answered:</Typography>
                    <Typography variant="body1" fontWeight="bold">
                        {answeredCount}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body1">Time Left:</Typography>
                    <Typography variant="body1" fontWeight="bold">
                        {remainingTime}
                    </Typography>
                </Box>
            </Paper>

            {/* Question Palette Card */}
            <Paper
                elevation={4}
                sx={{
                    width: 220,
                    padding: 2,
                    borderRadius: "8px",
                    mb: 2
                }}
            >
                <Typography variant="h6" align="center" gutterBottom>
                    Question Palette
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                    }}
                >
                    {questions.map((question, index) => (
                        <Box
                            key={index}
                            className={`question-number ${question.status}`}
                            onClick={() => navigateToQuestion(index)}
                            sx={{
                                padding: "1px",
                                margin: "3px",
                                borderRadius: "5%",
                                width: "30px",
                                height: "30px",
                                lineHeight: "30px",
                                backgroundColor: getColor(question.status),
                                color: "#fff",
                                textAlign: "center",
                                cursor: "pointer",
                                fontSize: "0.9rem"
                            }}
                        >
                            {index + 1}
                        </Box>
                    ))}
                </Box>
            </Paper>

            {/* Legend Card */}
            <Paper
                elevation={4}
                sx={{
                    width: 220,
                    padding: 2,
                    borderRadius: "8px",
                }}
            >
                <Typography variant="h6" align="center" gutterBottom>
                    Legend
                </Typography>
                {legendData.map((item, i) => (
                    <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Box 
                            sx={{
                                width: 12,
                                height: 12,
                                backgroundColor: item.color,
                                borderRadius: "50%",
                                marginRight: "8px",
                            }} 
                        />
                        <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                            {item.label}
                        </Typography>
                    </Box>
                ))}
            </Paper>
        </Box>
    );
}

// Status Color Handler
const getColor = (status) => {
    switch (status) {
        case "green":
            return "green";
        case "yellow":
            return "red";
        case "grey":
            return "grey";
        case "indigo":
            return "indigo";
        default:
            return "#6c757d";
    }
};

// Legend Data
const legendData = [
    { color: "green", label: "Answered" },
    { color: "grey", label: "Not Answered" },
    { color: "indigo", label: "Marked for Review" },
    { color: "red", label: "Visited but Not Answered" },
];

export default Sidebar;
