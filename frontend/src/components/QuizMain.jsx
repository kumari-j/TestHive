import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

const QuizMain = ({
  question,
  options,
  selectedOption,
  handleOptionChange,
  handleNext,
  handlePrevious,
  handleMarkForReview,
  handleSubmit,
}) => {
  return (
   <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    height: "100vh", // full height
    overflow: "hidden",
    pl: "16px", // Adjust if needed for sidebar padding
    pr: "16px",
  }}
>
  {/* Question + Options */}
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 4, // responsive gap
      flexGrow: 1,
      overflowY: "auto",
      pb: 2,
    }}
  >
    {/* Question */}
    <Box sx={{ flex: 1, minWidth: "250px" }}>
      <Typography variant="h5" fontWeight="bold">
        {question}
      </Typography>
    </Box>

    {/* Options + Navigation */}
    <Box
      sx={{
        flex: 2,
        minWidth: "300px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="quiz"
          name="quiz"
          value={selectedOption}
          onChange={handleOptionChange}
        >
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

      {/* Navigation Buttons */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Button variant="outlined" onClick={handlePrevious}>
          Previous Question
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleMarkForReview}
        >
          Mark for Review
        </Button>
        <Button variant="outlined" onClick={handleNext}>
          Next Question
        </Button>
      </Box>
    </Box>
  </Box>

  {/* Submit Button */}
  <Box sx={{ pt: 2 }}>
    <Button variant="contained" color="primary" onClick={handleSubmit}>
      Submit Test
    </Button>
  </Box>
</Box>

  );
};

export default QuizMain;
