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
        flex: 1,
        display: "flex",
        flexDirection: "column",
        pt: 6,
        px: 0, // Removed horizontal padding
        height: '100%', overflowY: 'auto' 
      }}
    >
      {/* Question + Options + Navigation buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: 20,
          mb: 4,
        }}
      >
        {/* Question (Extreme Left) */}
        <Box
          sx={{
            flexShrink: 30,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            pl: 0,
            mr: 0,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            {question}
          </Typography>
        </Box>

        {/* Options + Navigation Buttons in Column */}
        <Box
          sx={{
            width: "52%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
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
    value={option}
    control={<Radio />}
    label={option}
  />
))}

            </RadioGroup>
          </FormControl>

          {/* Navigation buttons directly under options */}
          <Box sx={{ display: "flex", gap:2}}>
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

      {/* Submit Button Centered at Bottom */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "left",
          mt: 10,
        }}
      >
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit Test
        </Button>
      </Box>
    </Box>
  );
};

export default QuizMain;
