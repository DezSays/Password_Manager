import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Register = () => {

  const [userData, setUserData] = useState({
    id: uuidv4(),
    email: '',
    pw: '',
    first_name: '',
    last_name: '',
    username: '',
    avatar_url: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      console.log(data); 
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
    <h2>Register</h2>
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={userData.pw}
        onChange={(e) => setUserData({ ...userData, pw: e.target.value })}
      />
      <input
        type="text"
        placeholder="First Name"
        value={userData.first_name}
        onChange={(e) =>
          setUserData({ ...userData, first_name: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Last Name"
        value={userData.last_name}
        onChange={(e) =>
          setUserData({ ...userData, last_name: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Username"
        value={userData.username}
        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
      />
      <input
        type="text"
        placeholder="Avatar URL"
        value={userData.avatar_url}
        onChange={(e) =>
          setUserData({ ...userData, avatar_url: e.target.value })
        }
      />
      <button type="submit">Register</button>
    </form>
  </div>
  );
};

export default Register;
