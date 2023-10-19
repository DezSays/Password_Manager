import React from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from './Token';

const Navbar = () => {
  const nav = useNavigate();
  const { token } = useToken();
  const handleLogout = async () => {
    try {
      const response = await fetch("https://lockbox-password-server.vercel.app/logout", {
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

  const handleNavHome = () => {
    nav('/dashboard')
  }

  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div onClick={handleNavHome} className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-xl tracking-tight">Lockbox</span>
        </div>
        <div className="flex-grow text-right">
          <button
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none"
            value={"dashboard"}
            onClick={(e) => handleNav(e.target.value)}
          >
            Dashboard
          </button>
          <button
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none"
            value={"addpass"}
            onClick={(e) => handleNav(e.target.value)}
          >
            Add Password
          </button>
          <button
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none"
            value={"login"}
            onClick={(e) => handleNav(e.target.value)}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
