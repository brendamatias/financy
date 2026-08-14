import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/stores/auth";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <>{children}</> : <Navigate to="/sign-in" replace />;
}

export { ProtectedRoute };
