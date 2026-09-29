// focuflow/frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import KanbanPage from './pages/KanbanPage';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Sidebar from './components/Sidebar.jsx';
import InteractiveStars from './components/InteractiveStars.jsx';
import CalendarPage from './pages/CalendarPage';
import HomePage from './pages/HomePage';
import './App.css';

const Layout = () => {
  const location = useLocation();
  const showStars = location.pathname === '/' || location.pathname === '/login';

  return (
    <div className="flex h-screen bg-soft-white">
      {showStars && <InteractiveStars />}

      <Sidebar />

      <main className="flex-grow ml-8 transition-all duration-300 ease-in-out">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
          />
          <Route
            path="/projects/:projectId"
            element={<ProtectedRoute><KanbanPage /></ProtectedRoute>}
          />
           {/* --- THIS IS THE MISSING/INCORRECT ROUTE --- */}
          <Route
            path="/calendar"
            element={<ProtectedRoute><CalendarPage /></ProtectedRoute>}
          />
          {/* ------------------------------------------- */}
        </Routes>
      </main>
    </div>
  );
};


function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}


export default App;