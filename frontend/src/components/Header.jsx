import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const Header = ({ quizTitle, answeredCount, remainingTime }) => {
    return (
        <AppBar position="fixed" sx={{ backgroundColor: '#007bff' }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {quizTitle}
                </Typography>
                <Typography variant="body1" sx={{ marginRight: 2 }}>
                    Answered: {answeredCount}
                </Typography>
                <Typography variant="body1">
                    Time Remaining: {remainingTime}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
