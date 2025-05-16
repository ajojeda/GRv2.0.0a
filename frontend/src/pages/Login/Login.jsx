// 📁 src/pages/Login/Login.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PermissionsContext } from '../../context/PermissionsContext';

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setPermissions } = useContext(PermissionsContext); // ✅ Import context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/auth/login', { email, password }, { withCredentials: true });
      console.log('Login success:', response.data);

      // ✅ Update context state immediately
      setUser(response.data.user);
      setPermissions(response.data.permissions);

      // ✅ Save user + permissions to localStorage (optional backup)
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('permissions', JSON.stringify(response.data.permissions));

      // 🚀 Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">GoodieRun Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border p-2 rounded mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full border p-2 rounded mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white p-2 rounded transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
