import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // DISINI MASALAHNYA: Sesuaikan 'token' menjadi 'auth_token'
  const token = localStorage.getItem('auth_token');

  if (!token) {
    // Jika token tidak ada, tendang ke login
    return <Navigate to="/login" replace />;
  }

  // Jika ada, tampilkan halaman yang diminta (Profil/Materi/dll)
  return children;
};

export default ProtectedRoute;