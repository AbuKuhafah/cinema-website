import React from 'react';
import './movieList.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Grid, Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { getMovies } from "../../data/repo";
import { useState, useEffect } from 'react';

function MovieList(props) {
  // Check if user is logged in
  const [movies, setMovies] = useState(null);

  // Load profiles.
  useEffect(() => {
    async function loadMovies() {
      try {
        const currentMovies = await getMovies();
        console.log(" currentMovies ", currentMovies);
        setMovies(currentMovies);
      } catch (error) {
        console.log(" currentMovies ", error);
      }

    }

    loadMovies();
  }, []);

  const userLoggedIn = props.user && props.user.username ? true : false;
  console.log("userlogged IN: ", userLoggedIn);

 

  if (movies === null)
    return null;

  return (
    <Grid container spacing={2} direction="row">
      {/* map though all movies to display them each in their own grid and with their own info */}
      {movies.map((movie) => (

        <Grid item xs={12} sm={6} md={4} className="grid-item">
          <Card className="movie-card">
            <CardMedia className="movie-image" image={movie.image_path} title={movie.Title} />
            <CardContent className="movie-card-content">
              <Typography variant="h5" component="div">
                {movie.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {movie.description}
              </Typography>
              <Typography variant="body2" >
                Rating: {movie.rating}
              </Typography>
            </CardContent>
            <CardActions className="review-button">
              <div>
                <Link className="nav-link" to="/viewReviews" state={{ movie: movie }}>
                  <Button>View Details</Button>
                </Link>
              </div>

              {userLoggedIn &&
                <div>
                  <Link className="nav-link" to="/review" state={{ movie: movie }}>
                    <Button size="small">Write Review</Button>
                  </Link>
                </div>
              }
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default MovieList;
