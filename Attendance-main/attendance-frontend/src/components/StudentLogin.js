import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

function StudentLogin() {
  const [registerNumber, setRegisterNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post('/student/login', {
        registerNumber,
        password
      });

      const studentData = response.data; // assuming { id, registerNumber, name, ... }

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(studentData));
      localStorage.setItem("role", "student");

      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/student");
      }, 1000);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage("❌ Invalid register number or password.");
      } else {
        setMessage("❌ Error connecting to server.");
      }
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🎓 Student Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Register Number:</label><br />
          <input
            type="text"
            value={registerNumber}
            onChange={(e) => setRegisterNumber(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '1.2rem' }}>🔓 Login</button>
      </form>

      {message && (
        <p style={{ marginTop: '1rem', color: message.startsWith("✅") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default StudentLogin;