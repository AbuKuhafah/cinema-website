import "./home.css"
import MovieList from "../movies/MovieList";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home({ user, movies }) {
  console.log("in home: ", user)
  return (
    <div className="container-fluid main">
      <div className="row">
        <MovieList movies={movies} user={user}></MovieList>
      </div>
    </div>
  )
};
