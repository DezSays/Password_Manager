import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard'; 
import { TokenProvider } from './Token';

function App() {
  return (
    <TokenProvider> 
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
    </TokenProvider>
  );
}

export default App;
