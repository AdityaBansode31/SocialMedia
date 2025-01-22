import React, { useState } from 'react';
import axios from 'axios';
import '../scss/Auth.scss';

const Register = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [passwordHash, setPassword] = useState('');
  const [error, setError] = useState('');
  const [Role, setRole] = useState('user')

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5261/api/User/addUser', {
        userName,
        email,
        passwordHash,
        Role
      });
      console.log(response.data);
      // Navigate to login page or display success message
    } catch (err) {
      setError('Error registering the user');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="text"
          value={Role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="user"
          required
        />
        <input
          type="password"
          value={passwordHash}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
