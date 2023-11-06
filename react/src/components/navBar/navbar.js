// Import necessary dependencies and styles
import React from "react";
import "./navbar.css";
import { Link } from "react-router-dom";

// Define the Navbar component
export default function Navbar(props) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <ul>
            <li>
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {props.user !== null &&
              <>
                <li>
                  <Link className="nav-link" to="/profile">My Profile</Link>
                </li>
              </>
            }
        </ul>
      </div>
        <div className="navbar-right">
        <ul>
            {props.user === null ?
              <>
                <li>
                  <Link className="nav-link" to="/signUp">Register</Link>
                </li>
                <li>
                  <Link className="nav-link" to="/signIn">Login</Link>
                </li>
              </>
              :
              <>
                <li>
                  <span className="welcome-message">Welcome to Loop Cinema!, {props.user.username}</span>
                </li>
                <li>
                  <Link className="nav-link" to="/signIn" onClick={props.logoutUser}>Logout</Link>
                </li>
              </>
            }
          </ul>
        </div>
          
    </nav>
  );
}

