import { Navigate } from "react-router";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthProvider";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }

  if (!user) {
    // redirect to login if not logged in
    return <Navigate to="/login" replace />;
  }

  return children;
}
