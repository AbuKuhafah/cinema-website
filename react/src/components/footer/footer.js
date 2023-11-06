// Import necessary dependencies and styles
import React, { useState, useEffect } from "react";
import "./footer.css";

// Define the Footer component
function Footer() {
  // Use state to track whether the footer should be visible
  const [isVisible, setIsVisible] = useState(false);

  // Set up an effect to handle scroll events
  useEffect(() => {
    // Define the scroll event handler function
    function handleScroll() {
      // Check if the page has been scrolled down
      if (window.scrollY > 0) {
        setIsVisible(true); // Set the footer to be visible
      } else {
        setIsVisible(false); // Set the footer to be hidden
      }
    }

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // The empty dependency array ensures that the effect runs only once

  // Render the Footer component
  return (
    <div className={`footer ${isVisible ? "visible" : ""}`}>
      <h2>Full Stack Development Assignment 2</h2>
    </div>
  );
}

// Export the Footer component for use in other parts of the application
export default Footer;
