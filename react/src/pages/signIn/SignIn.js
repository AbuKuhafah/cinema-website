// Import necessary dependencies and styles
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyUser } from "../../data/repo";
import './signIn.css';

// Define the SignIn component
export default function SignIn({change}) {
  const navigate = useNavigate();
  const [fields, setFields] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(null);
 
  // Generic change handler.
  const handleInputChange = (event) => {
    // let value = fields.email;
    setFields({ ...fields, [event.target.name]: event.target.value });
    // change(fields.email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const user = await verifyUser(fields.email, fields.password);
      
      // Set user state.
      change(user);
      // Navigate to the home page.
      navigate("/");
    } catch (error) {
      // Display the error message from the backend.
      setErrorMessage(error.response?.data?.error || "An unexpected error occurred");
    }
  };

  // Render the SignIn component
  return (
    <div>
      <h1>Login</h1>
      <hr />
      <div className="mainHeight">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="control-label">Email</label>
              <input name="email" id="email" className="form-control"
                value={fields.email} onChange={handleInputChange} />
            </div>
            <div className="form-group">
                <label htmlFor="password" className="control-label">Password</label>
              <input type="password" name="password" id="password" className="form-control"
                value={fields.password} onChange={handleInputChange} />
            </div>
                <br></br>
            <div className="form-group">
              <input type="submit" className="btn btn-primary" value="Login" />
            </div>
          </form>
          <div className="form-group">
          {
            errorMessage !== null &&  <span className="text-danger">{errorMessage}</span>
          }
          </div>
          
      </div>
    </div>
  );
}


