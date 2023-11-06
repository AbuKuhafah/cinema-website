// Import necessary dependencies and styles
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { findUser, createUser } from "../../data/repo";
import './signUp.css';

// Define the SignUp component
function SignUp(props) {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    username: "", email: "", firstname: "", lastname: "",  password: "", confirmPassword: ""
  });
  const [errors, setErrors] = useState({ });

  // Generic change handler.
  const handleInputChange = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form and if invalid do not contact API.
    const { trimmedFields, isValid } = await handleValidation();
    if(!isValid)
      return;

    // Create user.
    const user = await createUser(trimmedFields);

    // Set user state.
    props.loginUser(user);

    // Navigate to the home page.
    navigate("/");
  };

  const isStrongPassword = (password) => {
    // Password must be 8 characters in length, contain at least one uppercase letter,
    // and at least one symbol.
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+,\-./:;<=>?@[\\\]_`{|}~])(?=.{8,})/;
    return regex.test(password);
  }

  const handleValidation = async () => {
    const trimmedFields = trimFields();
    const currentErrors = { };

    // Validate username.
    let key = "username";
    let field = trimmedFields[key];
    if(field.length === 0)
      currentErrors[key] = "Username is required.";
    else if(field.length > 32)
      currentErrors[key] = "Username length cannot be greater than 32.";
    else if(await findUser(trimmedFields.username) !== null)
      currentErrors[key] = "Username is already registered.";

    // Validate email.
    key = "email";
    field = trimmedFields[key];
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(field.length === 0)
      currentErrors[key] = "Email is required.";
    else if(!emailPattern.test(field))
      currentErrors[key] = "Invalid email format.";
    else if(await findUser(trimmedFields.email) !== null) // Checking if email already exists.
      currentErrors[key] = "Email is already registered.";
    
    // Validate first name.
    key = "firstname";
    field = trimmedFields[key];
    if(field.length === 0)
      currentErrors[key] = "First name is required.";
    else if(field.length > 40)
      currentErrors[key] = "First name length cannot be greater than 40.";

    // Validate last name.
    key = "lastname";
    field = trimmedFields[key];
    if(field.length === 0)
      currentErrors[key] = "Last name is required.";
    else if(field.length > 40)
      currentErrors[key] = "Last name length cannot be greater than 40.";

    // Validate password.
    key = "password";
    field = trimmedFields[key];
    if (field.length === 0) {
      currentErrors[key] = "Password is required.";
    } else if (field.length < 8) {
      currentErrors[key] = "Password must contain at least 8 characters.";
    } else if (!isStrongPassword(field)) {
      currentErrors[key] = "Password must contain at least one uppercase letter and one symbol.";
    }

    // Validate confirm password.
    key = "confirmPassword";
    field = trimmedFields[key];
    if(field !== trimmedFields.password)
      currentErrors[key] = "Passwords do not match.";

    setErrors(currentErrors);

    return { trimmedFields, isValid: Object.keys(currentErrors).length === 0 };
  };

  const trimFields = () => {
    const trimmedFields = { };
    Object.keys(fields).map(key => trimmedFields[key] = fields[key].trim());
    setFields(trimmedFields);

    return trimmedFields;
  };

  // Render the SignUp component
  return (
    <div>
      <h1>Register</h1>
      <hr />
      <div className="mainHeight">
        <div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="control-label">Username</label>
              <input name="username" id="username" className="form-control"
                value={fields.username} onChange={handleInputChange} />
            </div>
            {errors.username &&
                <div className="text-danger">{errors.username}</div>
              }
            <div className="form-group">
              <label htmlFor="email" className="control-label">Email</label>
              <input name="email" id="email" className="form-control"
                value={fields.email} onChange={handleInputChange} />
              {errors.email &&
                <div className="text-danger">{errors.email}</div>
              }
            </div>
            <div className="form-group">
              <label htmlFor="firstname" className="control-label">First name</label>
              <input name="firstname" id="firstname" className="form-control"
                value={fields.firstname} onChange={handleInputChange} />
              {errors.firstname &&
                <div className="text-danger">{errors.firstname}</div>
              }
            </div>
            <div className="form-group">
              <label htmlFor="lastname" className="control-label">Last name</label>
              <input name="lastname" id="lastname" className="form-control"
                value={fields.lastname} onChange={handleInputChange} />
              {errors.lastname &&
                <div className="text-danger">{errors.lastname}</div>
              }
            </div>
            <div className="form-group">
              <label htmlFor="password" className="control-label">
                Password
              </label>
              <input type="password" name="password" id="password" className="form-control"
                value={fields.password} onChange={handleInputChange} aria-label="Password" />
            </div>
            {errors.password &&
                <div className="text-danger">{errors.password}</div>
              }
            <div className="form-group">
              <label htmlFor="confirmPassword" className="control-label">Confirm password</label>
              <input type="password" name="confirmPassword" id="confirmPassword" className="form-control"
                value={fields.confirmPassword} onChange={handleInputChange} />
              {errors.confirmPassword &&
                <div className="text-danger">{errors.confirmPassword}</div>
              }
            </div>
            <div className="form-group">
              <input type="submit" className="btn btn-primary" value="Register" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Export the SignUp component
export default SignUp;
