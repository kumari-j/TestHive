import React from "react";
import { AppBar, Toolbar, Box, Typography } from "@mui/material";

const Header = ({ Application_id, Test_id }) => {
    return (
        <AppBar position="fixed" sx={{ backgroundColor: "#1976d2", padding: "0.5rem" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                
                {/* Left - Logo */}
                <Box display="flex" alignItems="center">
                    <img 
                        src="/logo.png" 
                        alt="TestHive Logo"
                        style={{ width: "170px", height: "auto", objectFit: "contain" }}
                    />
                </Box>

                {/* Right - Test ID & Application ID */}
                <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                    <Typography variant="body1" color="white">
                        Application ID: <strong>{Application_id}</strong>
                    </Typography>
                    <Typography variant="body1" color="white">
                        Test ID: <strong>{Test_id}</strong>
                    </Typography>
                </Box>

            </Toolbar>
        </AppBar>
    );
};

export default Header;
