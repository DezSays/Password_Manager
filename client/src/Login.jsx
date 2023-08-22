import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from './Token'

function Login() {
  const { setToken, setUserID } = useToken();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, pw: pw }),
      });
      console.log('res',response)
      if (response.ok) {
        const data = await response.json()
        console.log(data.token)
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
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
