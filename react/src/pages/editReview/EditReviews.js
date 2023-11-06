import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './editReview.css';
import { Button, Rating } from "@mui/material";
import { updateReview } from "../../data/repo";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function EditReviews({ username }) {
    const location = useLocation()
    // pass down review data
    const review = location.state?.review;
    console.log("reviewID : " + review.post_id);
    const navigate = useNavigate();
    const [fields, setFields] = useState({ review: review.review, title: review.title, rating: review.rating });
    const [errorMessage, setErrorMessage] = useState(null);
    const [post, setPost] = useState(review.review);

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

        console.log("the errormessage is: ", errorMessage)
        if (fields.rating <= 0) {
            setErrorMessage("Rating cannot be 0");
            console.log("the errormessage is: ", errorMessage)
        } else if (post.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
            setErrorMessage("A review cannot be empty."); console.log("the errormessage is: ", errorMessage)
        } else if (post.length >= 600) {
            setErrorMessage("Review is too big");
            console.log("the errormessage is: ", errorMessage)
        }
        else {
            const updatedReview = { review: post, rating: fields.rating, email: review.email, title: review.title }
            console.log("the updatedReview is: ", updatedReview);

            await updateReview(updatedReview)
            navigate("/profile");
            setErrorMessage(null);
        }


    }

    return (
        <div className="main">
            <h1>{review.title}</h1>
            <form className="frm" onSubmit={handleSubmit}>
                <Rating value={fields.rating} name="rating" size="large" onChange={handleInputChange} />
                <br></br>
                <div className="feedback">
                    <ReactQuill theme="snow" value={post} onChange={setPost} style={{ height: "180px", width: "425px" }} />

                </div>
                <div id="container">

                    <Button className='btn_Save'>
                        <Link className="nav-link" to="/profile"> Cancel</Link>
                    </Button>
                    <Button className='btn_Save' type="submit" > Update
                    </Button>
                </div>
                {
                    errorMessage !== null && <span className="text-danger">{errorMessage}</span>
                }
            </form>
        </div>
    )
}

export default EditReviews