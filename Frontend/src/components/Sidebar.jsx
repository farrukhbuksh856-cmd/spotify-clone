import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import MusiclyLogo from './MusiclyLogo';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { resetPlayer } = usePlayer();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      resetPlayer();
      navigate('/login');
    }
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-200 ${
      isActive
        ? 'bg-[#282828] text-white'
        : 'text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a]'
    }`;

  const renderNavLinks = (closeMobile = false) => (
    <>
      <div className="bg-[#121212] rounded-xl p-2 flex flex-col gap-1">
        <NavLink
          to="/"
          className={navItemClass}
          onClick={() => closeMobile && setMobileOpen(false)}
          end
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/albums"
          className={navItemClass}
          onClick={() => closeMobile && setMobileOpen(false)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>Albums</span>
        </NavLink>
      </div>

      {user?.role === 'artist' && (
        <div className="bg-[#121212] rounded-xl p-2 flex flex-col gap-1 mt-2">
          <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#b3b3b3]">
            Artist Studio
          </div>
          <NavLink
            to="/upload"
            className={navItemClass}
            onClick={() => closeMobile && setMobileOpen(false)}
          >
            <svg className="w-5 h-5 text-[#1db954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Upload Music</span>
          </NavLink>

          <NavLink
            to="/create-album"
            className={navItemClass}
            onClick={() => closeMobile && setMobileOpen(false)}
          >
            <svg className="w-5 h-5 text-[#1db954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create Album</span>
          </NavLink>
        </div>
      )}
    </>
  );

  const renderUserCard = (closeMobile = false) => (
    user && (
      <div className="bg-[#121212] rounded-xl p-3 flex flex-col gap-3 shrink-0">
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-[#282828] text-[#1db954] flex items-center justify-center font-bold text-sm border border-[#3e3e3e]">
            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-semibold text-white truncate">{user.username}</span>
            <span className="text-[10px] font-bold tracking-wide uppercase text-[#1db954] bg-[#1db954]/10 px-1.5 py-0.5 rounded w-fit">
              {user.role}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            if (closeMobile) setMobileOpen(false);
            handleLogout();
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#282828] hover:bg-red-600/20 text-[#b3b3b3] hover:text-red-400 text-xs font-semibold transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Log out</span>
        </button>
      </div>
    )
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-black border-b border-[#282828] shrink-0 z-30">
        <div className="flex items-center gap-3">
          <MusiclyLogo size="sm" />
          <span className="text-lg font-bold tracking-tight text-white">Musicly</span>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-[#b3b3b3] hover:text-white focus:outline-none"
          aria-label="Open navigation menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/70 z-50 md:hidden transition-opacity"
        />
      )}

      {/* Mobile Slide-in Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-72 bg-black z-50 flex flex-col justify-between p-4 transform transition-transform duration-300 md:hidden h-dvh overflow-y-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#282828]">
            <div className="flex items-center gap-3">
              <MusiclyLogo size="sm" />
              <span className="text-lg font-bold text-white">Musicly</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1 text-[#b3b3b3] hover:text-white"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {renderNavLinks(true)}
        </div>

        <div className="mt-4">
          {renderUserCard(true)}
        </div>
      </div>

      {/* Desktop Navigation Sidebar */}
      <aside className="hidden md:flex w-64 bg-black flex-col justify-between p-3 h-full shrink-0 select-none overflow-y-auto">
        <div className="flex flex-col gap-2">
          {/* Brand logo header */}
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <MusiclyLogo size="md" />
            <span className="text-xl font-bold tracking-tight text-white">Musicly</span>
          </div>

          {renderNavLinks(false)}
        </div>

        <div className="mt-4">
          {renderUserCard(false)}
        </div>
      </aside>
    </>
  );
}