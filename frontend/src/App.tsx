import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import ProtectedRoute from './components/ProtectedRoute';

// Page imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SpinPage from './pages/SpinPage';
import InventoryPage from './pages/InventoryPage';
import TeamBattlePage from './pages/TeamBattlePage';
import DraftBattlePage from './pages/DraftBattlePage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/spin"
          element={
            <ProtectedRoute>
              <SpinPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <InventoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team-battle"
          element={
            <ProtectedRoute>
              <TeamBattlePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/draft-battle"
          element={
            <ProtectedRoute>
              <DraftBattlePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
