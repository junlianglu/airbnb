import React, { useState } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authService.register({ name, email, password, role });
      navigate('/login'); // Redirect to login page on successful registration
    } catch (err) {
      alert('Registration failed: ' + err.message);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Role Selection Dropdown */}
        <label htmlFor="role">Select Role:</label>
        <select 
          id="role" 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          required
        >
          <option value="user">User</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option> {/* You can hide admin in production */}
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
