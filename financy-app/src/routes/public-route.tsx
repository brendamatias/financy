import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/stores/auth";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  return !isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/dashboard" replace />
  );
}

export { PublicRoute };
