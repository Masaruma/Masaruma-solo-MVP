import { ReactNode } from "react";

import { useLocation, Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();

  // state がない（不正アクセス）ならトップへ戻す
  if (!location.state) {
    return <Navigate replace to={"/"} />;
  }

  // state があれば本来の子コンポーネントをレンダー
  return <>{children}</>;
};
