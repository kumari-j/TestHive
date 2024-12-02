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
    const handleRadioChange = (event) => {
        const value = event.target.value;
        onAnswerSelect(value); // Select the new value
    };

    return (
        <Box
            sx={{
                padding:3,
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: 2,
                width: "80%",
                height: "80%",
                
            }}
        >
            <Typography variant="h5" gutterBottom>
                {question}
            </Typography>
            <FormControl component="fieldset">
                <RadioGroup
                    value={selectedOption || ""} // Ensure it can handle empty string for deselection
                    onClick={handleRadioChange} // Custom handler for deselection
                >
                    {options.map((option, index) => (
                        <FormControlLabel
                            key={index}
                            value={option}
                            control={
                                <Radio 
                                    color="primary"
                                />
                            } // MUI Radio component
                            label={option}
                            checked={selectedOption === option} // Ensure the correct option is checked
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
