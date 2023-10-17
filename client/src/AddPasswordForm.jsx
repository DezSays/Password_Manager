import React, { useState } from 'react';
import { useToken } from './Token';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const AddPasswordForm = () => {
  const navigate = useNavigate();
  const { token, userID } = useToken();
  const [notes, setNotes] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAddPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://lockbox-password-server.vercel.app/users/${userID}/passwords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: uuidv4(),
          notes,
          site_url: siteUrl,
          pw: password,
          username,
        }),
      });

      if (response.ok) {
        console.log('Password added successfully');
        setNotes('');
        setSiteUrl('');
        setUsername('');
        setPassword('');
      } else {
        console.error('Error adding password');
      }
    } catch (error) {
      console.error('Error adding password:', error);
    }
  };

  const handleReturn = () => {
    navigate('/dashboard');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto py-12 px-4">

        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Add a new password to your lockbox:</h2>

        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
              Notes:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="siteUrl">
              Site URL:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="siteUrl"
              type="text"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
            />
          </div>
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
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <button
              className="bg-gray-500 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 sm:mt-0"
              onClick={handleAddPassword}
            >
              Add Password
            </button>
            <button
              className="text-gray-500 hover:text-blue-500 font-bold mt-4 sm:mt-0"
              onClick={handleReturn}
            >
              Return to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPasswordForm;
