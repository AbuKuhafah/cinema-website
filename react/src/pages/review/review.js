// Import necessary dependencies and styles
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './review.css';
import { Button, Rating } from "@mui/material";
import { createPost } from "../../data/repo";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { isUserLocked } from "../../data/repo";

// Define the SignIn component
function ReviewMovie({ user }) {
  const location = useLocation()
  const movie = location.state?.movie;
  const navigate = useNavigate();

  const [fields, setFields] = useState({review: '', movie: movie.title, rating: 0});
  const [errorMessage, setErrorMessage] = useState(null);
  const [post, setPost] = useState("");

  // Event handler for input field changes
  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    // Copy the fields and update the changed field
    const temp = { ...fields };
    temp[name] = value;
    setFields(temp);
  }
  
  //check for validation and submit reviews 
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      if (fields.rating <= 0) {
        throw new Error("Rating cannot be 0");
      } else if (post.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
        throw new Error("A review cannot be empty.");
      } else if (post.length >= 600) {
        throw new Error("Review is too big");
      }
  
      // Check if the user is locked
      const isLocked = await isUserLocked(user.email);
      if (isLocked) {
        throw new Error("Your account is locked and you cannot post reviews.");
      }
  
      // If not locked, proceed to post the review
      const newReview = {
        review: post,
        rating: fields.rating,
        email: user.email,
        title: movie.title,
      };
      await createPost(newReview);
      navigate("/");
      setErrorMessage(null);
    } catch (error) {
      console.error("Error:", error.message);
      setErrorMessage(error.message);
    }
  };
  
  return (
    <div className="main">
      <h1>{fields.movie}</h1>
      <form className="frm" onSubmit={handleSubmit}>
        <Rating name="rating" size="large" onChange={handleInputChange} />
        <br></br>
        <div className="feedback">
          <ReactQuill theme="snow" value={post} onChange={setPost} style={{ height: "180px", width: "425px" }} placeholder="Share details of your own experience watching this movie" />
        </div>
        <div id="container">
          <Button className='btn_Save'>
            <Link className="nav-link" to="/"> Cancel</Link>
          </Button>
          <Button className='btn_Save' type="submit" > Post
          </Button>
        </div>
        {
          errorMessage !== null && <span className="text-danger">{errorMessage}</span>
        }
      </form>
    </div>
  );
}

// Export the ReviewMovie component
export default ReviewMovie;
