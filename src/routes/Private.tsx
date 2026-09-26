import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router";

import { UserContext } from "../contexts/user";

interface PrivateProps {
  children: ReactNode;
}

export function Private({ children }: PrivateProps) {
  const { signed, loading } = useContext(UserContext);

  if (loading) {
    return <div></div>;
  }

  if (!signed) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
