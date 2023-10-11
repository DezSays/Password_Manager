import React, { useState } from 'react';
import { useToken } from './Token';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const AddPasswordForm = () => { 
  const navigate = useNavigate()
  const { token, userID } = useToken(); 
  const [notes, setNotes] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleAddPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/users/${userID}/passwords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: uuidv4(),
          notes,
          site_url: siteUrl,
          pw: password,
          username
        })
      });

      if (response.ok) {
        console.log('Password added successfully');
        setNotes('');
        setSiteUrl('');
        setPassword('');
        setUsername('');
      } else {
        console.error('Error adding password');
      }
    } catch (error) {
      console.error('Error adding password:', error);
    }
  };

  const handleReturn = () => {
    navigate('/dashboard')
  }
  return (
    <div>
      <Navbar />
      <h2>Add Password</h2>
      <label>
        Notes:
        <input type="text" value={notes} onChange={e => setNotes(e.target.value)} />
      </label>
      <br />
      <label>
        Site URL:
        <input type="text" value={siteUrl} onChange={e => setSiteUrl(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <br />
      <label>
        Username:
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      <br />
      <button onClick={handleAddPassword}>Add Password</button>
      <button onClick={handleReturn}>take me home tonight</button>
    </div>
  );
};

export default AddPasswordForm;
