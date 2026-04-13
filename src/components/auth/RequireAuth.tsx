import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type RequireAuthProps = {
  children: ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="mx-auto min-h-[50vh] max-w-3xl px-4 pt-28 text-center sm:px-6">
        <p className="text-sm text-sage-600">جاري تحميل الحساب...</p>
      </main>
    );
  }

  if (!user) {
    const redirect = `${location.pathname}${location.search}`;
    return <Navigate to={`/?auth=required&redirect=${encodeURIComponent(redirect)}`} replace />;
  }

  return children;
}
