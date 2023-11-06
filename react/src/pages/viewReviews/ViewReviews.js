import React from 'react'
import { useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import {
    Card, CardContent, Typography, Rating, CardMedia, CardActions,
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material';
import { getReviews, createReservation, getSessions, updateReservation, updateViews } from '../../data/repo';
import './viewReviews.css'

function ViewReviews(props) {
    //use location state to pass data from previous page
    const location = useLocation()
    // pass down movie data
    const movie = location.state?.movie;

    //get the reviews from localstorage
    const [reviews, setReviews] = useState(null);

    const [sessions, setSessions] = useState(null);
    const [ticketBooked, setTicketBooked] = useState(1);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    console.log("sesseons: ", sessions);

    // Load reviews and sessions.
    useEffect(() => {
        let isViewCountIncremented = false;
        async function loadReviews() {
            try {
                const currentReviews = await getReviews();
                const currentSessions = await getSessions();
                setReviews(currentReviews);
                setSessions(currentSessions);
                const updatedMovieViews = { title: movie.title, rating: movie.rating, description: movie.description, image_path: movie.image_path, views: movie.views };
                await updateViews(updatedMovieViews);
                isViewCountIncremented = true;
            } catch (error) {
                console.log("currentReviews", error);
            }
        }

        loadReviews();
    }, [movie]);

    const handleBookTickets = async () => {

        const remainingTicket = selectedSession.tickets - ticketBooked;
        console.log("the remainingTicket is: ", remainingTicket);

        if (remainingTicket < 0) {
            setErrorMessage("Cannot book more tickets than avialble");
            setTicketBooked(1);
        }
        else if (ticketBooked <= 0) {
            setErrorMessage("Cannot book 0 tickets");
            setTicketBooked(1);
        }
        else {
            const bookReservation = { email: props.user.email, session_id: selectedSession.session_id, tickets: ticketBooked }
            console.log("the bookReservation is: ", bookReservation);
            await createReservation(bookReservation);
            const updateSession = {
                session_id: selectedSession.session_id, movie_title: selectedSession.movie_title,
                session_time: selectedSession.session_time, tickets: remainingTicket
            }
            console.log("the updateSession is: ", updateSession);
            await updateReservation(updateSession);

            const currentSessions = await getSessions()
            console.log(" currentSessions ", currentSessions);
            setSessions(currentSessions);
            handleCloseDialog();
        }
    };

    const handleOpenDialog = (session) => {
        setSelectedSession(session);
        console.log("selected session: ", session);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedSession(null);
        setTicketBooked(1);
    };

    const userLoggedIn = props.user && props.user.username ? true : false;
    console.log("userlogged IN: ", userLoggedIn);

    if (reviews === null)
        return null;

    return (
        <div>
            <h1>{movie.title}</h1>
            <hr />
            <div className='mainView'>
                <div className='movie-section'>
                    <Card className="movie-card">
                        <CardMedia className="movie-image" image={movie.image_path} title={movie.Title} />
                        <CardContent className="movie-card-content">
                            <Typography variant="h5" component="div">
                                {movie.description}
                            </Typography>
                            <hr />
                            <h6>Available Sessions</h6>
                            {Object.keys(sessions).map((id) => {
                                const session = sessions[id];
                                if (movie.title === session.movie_title) {
                                    return (
                                        <div>
                                            <div className='session-container'>
                                                <div key={id}>{session.session_time} </div>
                                                <CardActions className="review-button">
                                                    {session.tickets > 0 &&
                                                        <div>
                                                            {userLoggedIn &&
                                                                <div>
                                                                    <Button size="small" onClick={() => handleOpenDialog(session)}>Book</Button>
                                                                    <Dialog open={openDialog} onClose={handleCloseDialog}>
                                                                        <DialogTitle>Book Tickets</DialogTitle>
                                                                        <DialogContent>
                                                                            <TextField
                                                                                autoFocus
                                                                                margin="dense"
                                                                                id="tickets"
                                                                                label="Number of Tickets"
                                                                                type="number"
                                                                                fullWidth
                                                                                value={ticketBooked}
                                                                                onChange={(e) => setTicketBooked(parseInt(e.target.value))}
                                                                            />
                                                                        </DialogContent>
                                                                        {
                                                                            errorMessage !== null && <span className="text-danger">{errorMessage}</span>
                                                                        }
                                                                        <DialogActions>
                                                                            <Button onClick={handleCloseDialog} color="primary">
                                                                                Cancel
                                                                            </Button>
                                                                            <Button
                                                                                onClick={handleBookTickets}
                                                                                color="primary"
                                                                            >
                                                                                Book
                                                                            </Button>
                                                                        </DialogActions>
                                                                    </Dialog>
                                                                </div>
                                                            }
                                                        </div>
                                                    }
                                                </CardActions>
                                            </div>
                                            <div>{session.tickets} Remainging Tickets</div>
                                        </div>
                                    );
                                }
                            })}
                        </CardContent>
                    </Card>
                </div>
                <div className='reviews-section'>
                    <div>
                        <div>
                            <h5>Reviews</h5>
                            {Object.keys(reviews).map((id) => {
                                const review = reviews[id];
                                if (movie.title === review.title) {
                                    return (
                                        <Card key={id} variant="outlined" sx={{ minWidth: 345 }}>
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {review.email}
                                                </Typography>
                                                <div dangerouslySetInnerHTML={{ __html: review.review }} />
                                                <Rating name="read-only" value={review.rating} readOnly />
                                            </CardContent>
                                        </Card>
                                    );
                                }
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewReviews;