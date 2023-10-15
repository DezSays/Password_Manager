import React from "react";
import { useNavigate } from "react-router-dom";
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
        window.location.reload(); // Add this line to reload the page
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
    <nav className="bg-gray-800 flex justify-around items-center p-4">
      <button
        className="bg-gray-700 text-white border-none px-4 py-2 cursor-pointer text-lg transition duration-300"
        value={"dashboard"}
        onClick={(e) => handleNav(e.target.value)}
      >
        Dashboard
      </button>
      <button
        className="bg-gray-700 text-white border-none px-4 py-2 cursor-pointer text-lg transition duration-300"
        value={"addpass"}
        onClick={(e) => handleNav(e.target.value)}
      >
        Add Password
      </button>
      <button
        className="bg-gray-700 text-white border-none px-4 py-2 cursor-pointer text-lg transition duration-300"
        value={"login"}
        onClick={(e) => handleNav(e.target.value)}
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
