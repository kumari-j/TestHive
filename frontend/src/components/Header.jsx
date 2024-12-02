import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const Header = ({ quizTitle, answeredCount, remainingTime, application_id }) => {
    return (
        <AppBar position="fixed" sx={{ backgroundColor: "#007bff" }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {(quizTitle = "Test Hive")}
                </Typography>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Application ID: {application_id}
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
