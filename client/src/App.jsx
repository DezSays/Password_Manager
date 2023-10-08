import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import AddPasswordForm from "./AddPasswordForm";
import { TokenProvider } from "./Token";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <TokenProvider>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addpass" element={<AddPasswordForm />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </TokenProvider>
  );
}

export default App;
