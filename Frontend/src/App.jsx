import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';

// Components & Layouts
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AlbumsPage from './pages/AlbumsPage';
import AlbumDetailPage from './pages/AlbumDetailPage';
import UploadMusicPage from './pages/UploadMusicPage';
import CreateAlbumPage from './pages/CreateAlbumPage';

// Main Application Layout Shell with Sidebar & Fixed Bottom Player
function MainLayout() {
  return (
    // pb-35 (140px, mobile) / md:pb-20 (80px, desktop): player ke liye jagah,
    // taake sidebar ka user card + Logout aur content player ke peeche na chhupein
    <div className="flex flex-col md:flex-row h-dvh bg-black overflow-hidden font-sans text-white pb-35 md:pb-20">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-h-0 bg-[#121212] m-2 md:ml-0 rounded-xl overflow-y-auto relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/albums" element={<AlbumsPage />} />
          <Route path="/albums/:albumId" element={<AlbumDetailPage />} />

          {/* Artist Only Routes */}
          <Route element={<ProtectedRoute artistOnly={true} />}>
            <Route path="/upload" element={<UploadMusicPage />} />
            <Route path="/create-album" element={<CreateAlbumPage />} />
          </Route>
        </Routes>
      </main>

      {/* Fixed Music Player Bar */}
      <Player />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Authentication Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated Application Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/*" element={<MainLayout />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PlayerProvider>
    </AuthProvider>
  );
}