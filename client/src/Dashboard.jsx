import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [pw, setPasswords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3003/users/:id/passwords`, {
      credentials: 'include'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          navigate('/login'); // Redirect to login page if not authorized
        }
      })
      .then(data => {
        if (data) {
          setPasswords(data);
        }
      })
      .catch(error => console.error('Error fetching passwords:', error));
  }, [navigate]);
  

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
