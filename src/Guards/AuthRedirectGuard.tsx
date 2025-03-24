import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/Store";

const AuthRedirectGuard = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default AuthRedirectGuard;
