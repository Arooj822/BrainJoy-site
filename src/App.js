// App.js
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from './pages/AuthPage';
import QuizBuilderPage from './pages/QuizBuilderPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ParentDashboard from './pages/ParentDashboard';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Routes>
      {/* Landing page route */}
      <Route path="/" element={<LandingPage />} />

      {/* Login / Sign Up */}
      <Route path="/login" element={<AuthPage />} />

      {/* Protected routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz-builder"
        element={
          <ProtectedRoute allowedRoles={['student', 'teacher', 'admin', 'parent']}>
            <QuizBuilderPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
