import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ADMIN_ROLE_ID = 99;

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** When true, only users with admin role can access this route */
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && userRole !== ADMIN_ROLE_ID) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
