import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css"; 

const Navbar = () => {
  const nav = useNavigate();
  const handleNav = (path) => {
    nav(`/${path}`);
  };

  return (
    <nav className="navbar">
      <button
        className="nav-button"
        value={"dashboard"}
        onClick={(e) => handleNav(e.target.value)}
      >
        Dashboard
      </button>
      <button
        className="nav-button"
        value={"addpass"}
        onClick={(e) => handleNav(e.target.value)}
      >
        Add Password
      </button>
      <button
        className="nav-button"
        value={"login"}
        onClick={(e) => handleNav(e.target.value)}
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
