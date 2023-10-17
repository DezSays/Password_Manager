import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from './Token';

const Login = () => {
  const { setToken, setUserID } = useToken();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://lockbox-password-server.vercel.app/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, pw: pw }),
      });
      if (response.ok) {
        const data = await response.json()
        setUserID(data.userID)
        setToken(data.token);
        navigate("/dashboard");
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full md:w-1/2 lg:w-1/3 p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl mb-4 text-center text-navy">Login</h2>
        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
        <form onSubmit={handleLogin} className="flex flex-col">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </div>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
            type="submit"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-700 text-lg my-4">
          Securely manage all your passwords in one place.
        </p>
        <div className="text-center">
          <span className="text-gray-700 text-sm">Don't have an account?</span>
          <a href="/register" className="text-blue-500 hover:text-blue-700 text-sm font-semibold ml-2">
            Register here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;