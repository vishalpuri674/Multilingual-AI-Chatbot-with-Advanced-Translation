import React from "react";
import "./Header.css"; // Import the CSS file for styling
import { FaComments } from "react-icons/fa"; 

const Header = () => {
  return (
    <header className="header-container">
      <div className="header-content">
        <div className="header-icon">
          <FaComments size={32} />
        </div>
        <h1 className="header-title" style={{ textAlign: 'center' }}>Your AI Assist</h1>
      </div>
    </header>
  );
};

export default Header;