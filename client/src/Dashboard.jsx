import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToken } from './Token';

const Dashboard = () => {
  const { token, userID } = useToken();
  const [pw, setPasswords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fix endpoint below 
    fetch(`http://localhost:3000/users/${userID}/passwords`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          navigate('/login'); 
        }
      })
      .then(data => {
        if (data) {
          setPasswords(data);
        }
      })
      .catch(error => console.error('Error fetching passwords:', error));
  }, [token]);
  

  return (
    <div>
      <h1>Passwords Dashboard</h1>
      <ul>
        {pw.length > 0 ? (
          pw.map(password => (
            <li key={password.password_id}>
              <strong>Site URL:</strong> {password.site_url}<br />
              <strong>Username:</strong> {password.username}<br />
              <strong>Notes:</strong> {password.notes}<br />
              <strong>pw:</strong> {password.pw}<br />
            </li>
          ))
        ) : (
          <p>No passwords found for this user.</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
