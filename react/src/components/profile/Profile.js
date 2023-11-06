import React from "react";
import { Menu, IconButton, MenuItem, Typography, Popover } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import './profile.css'


function Profile({ logoutUser }) {
    //set useStates
    const [selectedEl, setSelectedEl] = useState(null);
    const [openedMenu, setOpenedMenu] = useState(false);

    const divRef = useRef();

    //handle menu open
    function handleOpenMenu() {
        setOpenedMenu(true);
        setSelectedEl(divRef.current)
    }

    //handle menu close
    function handleCloseMenu(e) {
        setOpenedMenu(false);
        setSelectedEl(null)
    }

    useEffect(() => {
        setSelectedEl(divRef.current);
    }, [divRef]);

    return (
        <div>
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                ref={divRef}
                onClick={handleOpenMenu}
            >
                <img src='/whiteAccountSmall.png' alt="Profile Icon"></img>

            </IconButton>
            <Popover
                id="menu-appbar"
                open={openedMenu}
                anchorEl={selectedEl}
                onClose={handleCloseMenu}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
            >
                <Link className="nav-link" to="/profile" onClose={handleCloseMenu}>
                    <MenuItem>Profile</MenuItem>
                </Link>
                <Link className="nav-link" to="/signIn" onClick={logoutUser}>
                    <MenuItem>Sign Out</MenuItem>
                </Link>
            </Popover>




        </div>
    )
}

export default Profile;