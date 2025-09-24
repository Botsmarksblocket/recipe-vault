import { Navigate } from "react-router";
import { useAuth } from "../context/AuthProvider";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return;
  }

  if (!user) {
    // redirect to login if not logged in
    return <Navigate to="/login" replace />;
  }

  return children;
}
