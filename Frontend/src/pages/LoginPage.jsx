import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const isEmail = identifier.includes('@');
    const result = await login({
      username: !isEmail ? identifier : undefined,
      email: isEmail ? identifier : undefined,
      password,
    });

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col justify-center items-center p-4">
      {/* Spotify logo Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-[#1db954] flex items-center justify-center shadow-lg shadow-[#1db954]/20">
          <svg className="w-7 h-7 fill-current text-black" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.308-1.758-8.793-.963-.335.077-.67-.133-.746-.467-.077-.334.132-.67.467-.746 3.808-.87 7.076-.496 9.722 1.122.294.18.386.563.207.847zm1.226-2.724c-.226.367-.707.483-1.074.257-2.688-1.652-6.785-2.131-9.965-1.166-.413.125-.848-.106-.973-.518-.125-.413.106-.848.518-.973 3.632-1.102 8.147-.568 11.237 1.328.367.226.483.707.257 1.072zm.136-2.836C14.71 8.906 8.5 8.705 4.908 9.796c-.503.153-1.033-.135-1.185-.638-.153-.503.135-1.033.638-1.185 4.123-1.252 10.985-1.02 15.176 1.468.453.269.602.855.333 1.308-.269.454-.855.601-1.308.333z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Spotify Clone</h1>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#000000] p-8 rounded-2xl border border-[#282828] shadow-2xl">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Log in to continue</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#b3b3b3] mb-2">
              Username or Email
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Username or email address"
              className="w-full bg-[#121212] border border-[#383838] rounded-lg px-4 py-3 text-white placeholder-[#555555] focus:outline-none focus:border-[#1db954] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#b3b3b3] mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#121212] border border-[#383838] rounded-lg px-4 py-3 text-white placeholder-[#555555] focus:outline-none focus:border-[#1db954] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1db954] hover:bg-[#1ed760] text-black font-bold py-3 rounded-full mt-4 transition-transform active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'LOG IN'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#282828] text-center">
          <p className="text-sm text-[#b3b3b3]">
            Don't have an account?{' '}
            <Link to="/register" className="text-white hover:text-[#1db954] font-semibold underline ml-1">
              Sign up for Spotify
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
