import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MusiclyLogo from '../components/MusiclyLogo';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const result = await register({
      username,
      email,
      password,
      role,
    });

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col justify-center items-center p-4">
      {/* Brand logo header */}
      <div className="flex items-center gap-3 mb-8">
        <MusiclyLogo size="lg" />
        <h1 className="text-3xl font-bold text-white tracking-tight">Musicly</h1>
      </div>

      {/* Registration Card */}
      <div className="w-full max-w-md bg-[#000000] p-8 rounded-2xl border border-[#282828] shadow-2xl">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Sign up</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#b3b3b3] mb-2">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a profile name"
              className="w-full bg-[#121212] border border-[#383838] rounded-lg px-4 py-3 text-white placeholder-[#555555] focus:outline-none focus:border-[#1db954] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#b3b3b3] mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
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
              placeholder="Create a strong password"
              className="w-full bg-[#121212] border border-[#383838] rounded-lg px-4 py-3 text-white placeholder-[#555555] focus:outline-none focus:border-[#1db954] transition-colors"
            />
          </div>

          {/* Account Role Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#b3b3b3] mb-2">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'user'
                    ? 'bg-[#1db954]/10 border-[#1db954] text-[#1db954]'
                    : 'bg-[#121212] border-[#383838] text-[#b3b3b3] hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Listener
              </button>

              <button
                type="button"
                onClick={() => setRole('artist')}
                className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'artist'
                    ? 'bg-[#1db954]/10 border-[#1db954] text-[#1db954]'
                    : 'bg-[#121212] border-[#383838] text-[#b3b3b3] hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-2v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12 0c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-2" />
                </svg>
                Artist
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1db954] hover:bg-[#1ed760] text-black font-bold py-3 rounded-full mt-4 transition-transform active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'SIGN UP'}
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
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:text-[#1db954] font-semibold underline ml-1">
              Log in
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
