import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToken } from './Token';
import Navbar from './Navbar';

const Dashboard = () => {
  const { token, userID } = useToken();
  const [passwords, setPasswords] = useState([]);
  const [editingPasswordId, setEditingPasswordId] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [avatar, setAvatar] = useState('')
  const [first_name, setFirst_name] = useState('')
  const [last_name, setLast_name] = useState('')
  const [username, setUsername] = useState('')
  const navigate = useNavigate();

  const fetchPasswords = () => {
    fetch(`https://lockbox-password-server.vercel.app/users/${userID}/passwords`, {
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
          setPasswords(data.map(password => ({ ...password, revealed: false })));
        }
      })
      .catch(error => console.error('Error fetching passwords:', error));
  };

  const fetchUser = () => {
<<<<<<< HEAD
    fetch(`http://localhost:3000/users/${userID}`, {
=======

    fetch(`https://lockbox-password-server.vercel.app/users/${userID}`, {

>>>>>>> d2f0e85237dc56d2959514732b80f4a8e0c2fdd7
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
          setAvatar(data.avatar_url)
          setFirst_name(data.first_name)
          setLast_name(data.last_name)
          setUsername(data.username)
        }
      })
      .catch(error => console.error('Error fetching user:', error));
  };
  useEffect(() => {
    fetchPasswords();
    fetchUser();
  }, [token]);

  const toggleReveal = (index) => {
    const updatedPasswords = [...passwords];
    updatedPasswords[index].revealed = !updatedPasswords[index].revealed;
    setPasswords(updatedPasswords);
  };

  const handleDelete = (passwordId) => {
    fetch(`https://lockbox-password-server.vercel.app/users/${userID}/passwords/${passwordId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          fetchPasswords(); 
        }
      })
      .catch(error => console.error('Error deleting password:', error));
  };

  const handleEdit = (passwordId) => {
    setEditingPasswordId(passwordId);
    const passwordToEdit = passwords.find(password => password.id === passwordId);
    setEditedValues({ ...passwordToEdit });
  };

  const handleUpdate = (index, updatedPassword) => {
    fetch(`https://lockbox-password-server.vercel.app/users/${userID}/passwords/${updatedPassword.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedPassword)
    })
      .then(response => {
        if (response.ok) {
          const updatedPasswords = [...passwords];
          updatedPasswords[index] = updatedPassword;
          setPasswords(updatedPasswords);
          setEditingPasswordId(null); 
        }
      })
      .catch(error => console.error('Error updating password:', error));
  };

  const handleInputChange = (field, value) => {
    setEditedValues(prevValues => ({
      ...prevValues,
      [field]: value
    }));
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-8">
        <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="w-1/4 text-center">
              <img
                src={avatar}
                alt={username}
                className="rounded-full w-24 h-24 mx-auto mb-2"
              />
              <h5 className="text-gray-800 text-lg font-semibold">{first_name} {last_name}</h5>
            </div>
            <div className="w-3/4 text-center">
              <h1 className="text-3xl text-gray-800 font-semibold">
                {username ? `${username}'s Dashboard` : 'Please Login' }
              </h1>
            </div>
          </div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {passwords.length > 0 ? (
            passwords.map((password, index) => (
              <div key={password.id} className="mb-6 bg-gray-100 rounded-lg shadow-md p-6 relative">
                <div>
                  <span className="text-gray-800 text-sm">Site URL:</span>
                  {editingPasswordId === password.id ? (
                    <input
                      type="text"
                      value={editedValues.site_url || ''}
                      onChange={(e) => handleInputChange('site_url', e.target.value)}
                      className="border rounded w-full p-2 mt-1 text-gray-800"
                    />
                  ) : (
                    <span className="text-gray-800"> {password.site_url} </span>
                  )}
                </div>
                <div>
                  <span className="text-gray-800 text-sm">Username:</span>
                  {editingPasswordId === password.id ? (
                    <input
                      type="text"
                      value={editedValues.username || ''}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="border rounded w-full p-2 mt-1 text-gray-800"
                    />
                  ) : (
                    <span className="text-gray-800"> {password.username} </span>
                  )}
                </div>
                <div>
                  <span className="text-gray-800 text-sm">Notes:</span>
                  {editingPasswordId === password.id ? (
                    <textarea
                      value={editedValues.notes || ''}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="border rounded w-full p-2 mt-1 text-gray-800"
                    ></textarea>
                  ) : (
                    <span className="text-gray-800"> {password.notes} </span>
                  )}
                </div>
                <div className="mt-4">
                  {editingPasswordId === password.id ? (
                    <input
                      type="password"
                      value={editedValues.pw || ''}
                      onChange={(e) => handleInputChange('pw', e.target.value)}
                      className="border rounded w-full p-2 mt-1 text-gray-800"
                    />
                  ) : (
                    <div className="flex items-center">
                      <span className="text-gray-800">
                        {password.revealed ? password.pw : '********'}
                      </span>
                      {password.revealed ? (
                        <button
                          onClick={() => toggleReveal(index)}
                          className="bg-gray-300 hover:bg-blue-500 text-gray-800 font-bold py-1 px-2 rounded ml-2"
                        >
                          Hide
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleReveal(index)}
                          className="bg-gray-300 hover:bg-blue-500 text-gray-800 font-bold py-1 px-2 rounded ml-2"
                        >
                          Reveal
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 mb-2 mr-2 flex flex-col items-end">
                  {editingPasswordId === password.id ? (
                    <button
                      onClick={() => handleUpdate(index, editedValues)}
                      className="bg-gray-300 hover:bg-blue-500 text-gray-800 font-bold py-2 px-4 rounded mb-2"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(password.id)}
                      className="bg-gray-300 hover:bg-blue-500 text-gray-800 font-bold py-2 px-4 rounded mb-2"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(password.id)}
                    className="bg-gray-300 hover:bg-red-500 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-800 mt-4">No passwords found for this user.</p>
          )}
        </div>
      </div>
    </>
  );
  
};

export default Dashboard;
