import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToken } from './Token';
import bcrypt from 'bcryptjs'; 

const Dashboard = () => {
  const { token, userID } = useToken();
  const [passwords, setPasswords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
          // Decrypt passwords using bcrypt
          const decryptedPasswords = data.map(entry => ({
            ...entry,
            pw: bcrypt.hashSync(entry.pw, 10) // Decrypt the password
          }));
          setPasswords(decryptedPasswords);
        }
      })
      .catch(error => console.error('Error fetching passwords:', error));
  }, [token]);

  const handleClick = () => {
    navigate('/addpass')
  }

  return (
    <div>
      <h1>Passwords Dashboard</h1>
      <ul>
        {passwords.length > 0 ? (
          passwords.map(password => (
            <li key={password.password_id}>
              <strong>Site URL:</strong> {password.site_url}<br />
              <strong>Username:</strong> {password.username}<br />
              <strong>Notes:</strong> {password.notes}<br />
              <strong>Password:</strong> {password.pw}<br />
            </li>
          ))
        ) : (
          <p>No passwords found for this user.</p>
        )}
      </ul>
      <button onClick={handleClick}>take me to add passwords</button>
    </div>
  );
};

export default Dashboard;
