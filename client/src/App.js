import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UrlList from './pages/UrlList';
import UrlForm from './pages/UrlForm';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import UrlAnalytics from './pages/UrlAnalytics';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A1A2E',
              color: '#E2E8F0',
              border: '1px solid rgba(124, 58, 237, 0.2)',
            },
            success: {
              iconTheme: { primary: '#A855F7', secondary: '#1A1A2E' },
            },
            error: {
              iconTheme: { primary: '#F87171', secondary: '#1A1A2E' },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          
          <Route path="/urls" element={
            <ProtectedRoute><UrlList /></ProtectedRoute>
          } />
          
          <Route path="/urls/create" element={
            <ProtectedRoute><UrlForm /></ProtectedRoute>
          } />

          <Route path="/urls/:id/analytics" element={
            <ProtectedRoute><UrlAnalytics /></ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>
          } />

          <Route path="/admin/urls/:id/analytics" element={
            <ProtectedRoute adminOnly={true}><UrlAnalytics /></ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;