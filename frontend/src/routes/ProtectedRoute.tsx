import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import Loadingpage from "../components/Loadingpage";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { accessToken, refreshAccessToken, loading } = useAuth();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!accessToken) {
        const success = await refreshAccessToken();
        setIsAuth(success);
      } else {
        setIsAuth(true);
      }
      setChecking(false);
    };
    checkAuth();
  }, [accessToken, refreshAccessToken]);

  if (loading || checking) return <Loadingpage />;

  return isAuth ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default ProtectedRoute;
