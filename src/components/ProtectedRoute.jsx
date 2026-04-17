// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />; // si no está logueado

  if (role && user.rol !== role) return <Navigate to="/" />; // si no tiene el rol

  return children;
}
