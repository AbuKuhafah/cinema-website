import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Card, CardHeader, IconButton, Avatar, Box, CardContent, Typography, Rating, CardActions } from "@mui/material";
import './profileManagement.css'
import { getAllReservationByEmail, deleteUser, getAllReviewsByEmail, deleteReview, getSessionById } from '../../data/repo';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function ProfileManagement({ user, logoutUser }) {

    const [open, setOpen] = React.useState(false);
    let subtitle = "";
    if (user !== null) {
        subtitle = <p>{user.username}<br></br>{user.email}<br></br>{user.joined_in.split('T')[0]}</p>;
    }

    //get the reviews from localstorage
    const [reviews, setReviews] = useState(null);

    const [userSessionsData, setUserSessionsData] = useState([]);

    // Load reviews.
    useEffect(() => {
        async function loadReviews() {
            try {
                const reviewByEmail = await getAllReviewsByEmail(user.email);
                console.log(" reviewByEmail ", reviewByEmail);
                setReviews(reviewByEmail);

                const sessionsByEmail = await getAllReservationByEmail(user.email);
                const userSessionsPromises = sessionsByEmail.map(session => getSessionById(session.session_id));
                const allUserSessions = await Promise.all(userSessionsPromises);
                setUserSessionsData(allUserSessions);
            } catch (error) {
                console.log(" currentReviews ", error);
            }
        }
        loadReviews();
    }, []);

    //handle delete open
    const handleDeleteOpen = () => {
        setOpen(true);
    };
    //handle delete close
    const handleDeleteClose = () => {
        setOpen(false);
    };
    //handle user delete
    function userDeletion() {
        //delete user and logout
        for (let i = 0; i < reviews.length; i++) {
            if (reviews[i].email === user.email) {
                deleteReview(reviews[i].post_id);
            }
            console.log(reviews[i]);
        }

        deleteUser(user.email);
        logoutUser();
    }
    //delete reviews based off ids
    async function handleDelete(post_id) {
        deleteReview(post_id);
        window.location.reload();
    };

    if (reviews === null || user === null || userSessionsData === null)
        return null;

    return (
        <div className='main'>
            <h1>Profile</h1>
            <hr />
            <Box
                display="flex"
                justifyContent="center"
                alignItems="top"
            >
                <Card sx={{ minWidth: 345 }}>
                    <CardHeader
                        avatar={
                            <Avatar>
                                <img src='/whiteAccountSmall.png' alt="Profile Icon"></img>
                            </Avatar>
                        }
                        action={
                            <div>
                                <Link className="nav-link" to={`/edit/${user.email}`}>
                                    <IconButton aria-label="edit">
                                        <img src='/edit.png' alt='edit-icon' />
                                    </IconButton>
                                </Link>
                                <IconButton aria-label="delete" onClick={handleDeleteOpen}>
                                    <img src='/delete.png' alt='delete-icon' />
                                </IconButton>
                                {/* open dialog for visual cue for deleteion */}
                                <Dialog
                                    open={open}
                                    keepMounted
                                    aria-describedby="alert-dialog-slide-description"
                                >
                                    <DialogTitle>{"Delete Account"}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-slide-description">
                                            Confirm to delete you account.
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleDeleteClose}>Cancel</Button>
                                        <Link className="nav-link" to="/signIn" onClick={userDeletion}>
                                            <Button>Confirm</Button>
                                        </Link>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        }
                        title={subtitle}
                    >
                    </CardHeader>
                </Card>
            </Box>
            <br></br>
            <div className='review'>
                <h5>Booked Sessions</h5>
                {userSessionsData.map(session => (
                    <Card sx={{ minWidth: 345 }}>
                        <Typography gutterBottom variant="h6" component="div">
                            {session.movie_title}</Typography>
                        <Typography gutterBottom variant="h7" component="div">
                            Sessiong time: {session.session_time}
                        </Typography>
                        <Typography gutterBottom variant="h7" component="div">
                            Tickets: {session.tickets}
                        </Typography>
                    </Card>
                ))}
            </div>
            <div className='review'>
                <h5>Reviews</h5>
                {Object.keys(reviews).map((id) => {
                    const review = reviews[id];
                    if (user.email === review.email) {
                        const isReviewDisabled = review.review.includes("[**** This review has been deleted by the admin ***]");
                        console.log("isReviewDisabled: " + isReviewDisabled);
                        return (
                            <Card variant="outlined" sx={{ width: 345 }} key={review.post_id}
                            >
                                <CardContent >
                                    <Typography gutterBottom variant="h5" component="div">
                                        {review.title}
                                    </Typography>
                                    <div dangerouslySetInnerHTML={{ __html: review.review }} />
                                    <Rating name="read-only" value={review.rating} readOnly />
                                    <CardActions>
                                        {!isReviewDisabled &&
                                            <div>
                                                <Link className="nav-link" to={"/editReview"} state={{ review: review }}>
                                                    <Button>Edit</Button>
                                                </Link>
                                            </div>
                                        }

                                        <div>
                                            <Button onClick={() => handleDelete(review.post_id)}>Delete</Button>
                                        </div>
                                    </CardActions>
                                </CardContent>
                            </Card>
                        );
                    }
                })}
            </div>
        </div>
    )
}

export default ProfileManagement;