// frontend/src/pages/Login/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../context/PermissionsContext';

export default function Login() {
  const { setUserContext } = usePermissions();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@goodierun.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    console.log("📨 Sending login request to /auth/login", { email: trimmedEmail, password: trimmedPassword });
    console.log("🧪 FINAL PAYLOAD SENT:", JSON.stringify({ email: trimmedEmail, password: trimmedPassword }));

    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      console.log("📥 Response status:", res.status);
      const contentType = res.headers.get('content-type');

      if (!res.ok) {
        if (contentType?.includes('application/json')) {
          const { message } = await res.json();
          throw new Error(message || 'Invalid credentials');
        } else {
          throw new Error('Invalid credentials');
        }
      }

      const data = await res.json();
      console.log("✅ Login response data:", data);

      if (!data?.user) throw new Error('Malformed response from server');
      setUserContext(data.user, data.permissions);
      navigate('/');
    } catch (err) {
      console.error('❌ Login failed:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Sign In to GoodieRun</h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
