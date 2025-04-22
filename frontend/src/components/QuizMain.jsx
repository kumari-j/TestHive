import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Divider,
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
        height: "100vh",
        overflow: "hidden",
        pl: "16px",
        pr: "16px",
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 4,
          flexGrow: 1,
          overflowY: "auto",
          pb: 8, // space for footer
        }}
      >
        {/* Question */}
        <Box sx={{ flex: 1, minWidth: "250px" }}>
          <Typography variant="h5" fontWeight="bold">
            {question}
          </Typography>
        </Box>

        {/* Divider */}
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            display: { xs: "none", md: "block" },
            borderColor: "grey.300",
            mx: 2,
          }}
        />

        {/* Options */}
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
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "#fff",
          boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 4,
          py: 1, // reduced height
          zIndex: 1000,
        }}
      >
        {/* Submit on the left */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ height: "36px", fontSize: "0.85rem" }}
        >
          Submit Test
        </Button>

        {/* Navigation from mid-right */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-start",
            ml: "auto", // push to center-right
            maxWidth: "600px",
          }}
        >
          <Button
            variant="outlined"
            onClick={handlePrevious}
            sx={{ height: "36px", fontSize: "0.85rem" }}
          >
            Previous Question
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleMarkForReview}
            sx={{ height: "36px", fontSize: "0.85rem" }}
          >
            Mark for Review
          </Button>
          <Button
            variant="outlined"
            onClick={handleNext}
            sx={{ height: "36px", fontSize: "0.85rem" }}
          >
            Next Question
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default QuizMain;
