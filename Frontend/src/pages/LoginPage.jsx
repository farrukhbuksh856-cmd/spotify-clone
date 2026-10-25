import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MusiclyLogo from '../components/MusiclyLogo';

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
      {/* Brand logo Header */}
      <div className="flex items-center gap-3 mb-8">
        <MusiclyLogo size="lg" />
        <h1 className="text-3xl font-bold text-white tracking-tight">Musicly</h1>
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

        {/* Learning disclaimer below form */}
        <div className="mt-6 p-3 bg-[#181818] border border-white/10 rounded-xl text-center">
          <p className="text-xs text-[#a0a0a0] leading-relaxed">
            Demo project for learning. Not affiliated with Spotify. Do not enter your real Spotify or any real password.
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-[#282828] text-center">
          <p className="text-sm text-[#b3b3b3]">
            Don't have an account?{' '}
            <Link to="/register" className="text-white hover:text-[#1db954] font-semibold underline ml-1">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Small footer */}
      <footer className="mt-8 text-center text-xs text-[#a0a0a0]">
        Musicly - portfolio project by Farrukh. Not affiliated with Spotify.
      </footer>
    </div>
  );
}
