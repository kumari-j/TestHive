import React from "react";
import {
    Box,
    Typography,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Stack, // Importing Stack from MUI for layout
} from "@mui/material";

const QuizMain = ({
    question,
    options,
    selectedOption,
    onAnswerSelect,
    onMarkForReview,
    onSubmitTest,
    onPreviousQuestion, // Prop for previous button functionality
    onNextQuestion, // Prop for next button functionality
}) => {
    return (
        <Box
            sx={{
                padding: 3,
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: 2,
            }}
        >
            <Typography variant="h5" gutterBottom>
                {question}
            </Typography>
            <FormControl component="fieldset">
                <RadioGroup
                    value={selectedOption}
                    onChange={(e) => onAnswerSelect(e.target.value)}
                >
                    {options.map((option, index) => (
                        <FormControlLabel
                            key={index}
                            value={option}
                            control={<Radio color="primary" />} // MUI Radio component
                            label={option}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
            {/* Using Stack for horizontal alignment */}
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                    variant="outlined"
                    color="primary" // Color for Previous button
                    onClick={onPreviousQuestion}
                >
                    Previous
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={onMarkForReview}
                >
                    Mark for Review
                </Button>
                <Button
                    variant="outlined"
                    color="primary" // Color for Next button
                    onClick={onNextQuestion}
                >
                    Next
                </Button>
            </Stack>
        </Box>
    );
};

export default QuizMain;
