import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Public/Landing';
import { FormFlow } from './pages/Public/FormFlow';
import { AdminLayout } from './pages/Admin/AdminLayout';
import { Login } from './pages/Admin/Login';
import PrivacyPolicy from './pages/Public/PrivacyPolicy';
import TermsOfUse from './pages/Public/TermsOfUse';

const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem('adminAuth') === 'true';
  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/privacidade" element={<PrivacyPolicy />} />
        <Route path="/termos" element={<TermsOfUse />} />
        <Route path="/triagem" element={<FormFlow />} />
        <Route path="/admin/login" element={<Login />} />
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
