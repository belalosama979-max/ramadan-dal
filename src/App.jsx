import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import Layout from './layouts/Layout';

// Lazy loading pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const NameEntryPage = lazy(() => import('./pages/NameEntryPage'));
const QuestionPage = lazy(() => import('./pages/QuestionPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useGame();
    if (loading) return <div className="min-h-screen flex items-center justify-center text-primary">جاري التحميل...</div>;
    if (!user) return <Navigate to="/name" replace />;
    return children;
};

function AppRoutes() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-primary">جاري التحميل...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/name" element={<NameEntryPage />} />
            <Route 
                path="/question" 
                element={
                    <ProtectedRoute>
                        <QuestionPage />
                    </ProtectedRoute>
                } 
            />
            <Route path="/admin" element={<AdminPage />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppRoutes />
    </GameProvider>
  );
}
