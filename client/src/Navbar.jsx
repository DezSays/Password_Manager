import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css"; 
import { useToken } from './Token';

const Navbar = () => {
  const nav = useNavigate();
  const { token } = useToken();
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        nav(`/login`);
        window.location.reload(); 
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleNav = (path) => {
    if (path === "login") {
      handleLogout();
    } else {
      nav(`/${path}`);
    }
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
