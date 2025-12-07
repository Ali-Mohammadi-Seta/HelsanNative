import { Navigate, Outlet, useLocation } from "react-router";
import * as pathRoute from "./pathRoutes";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export const PrivateRoutes = () => {
  const { isLoggedIn } = useSelector(
    (state: { auth: { isLoggedIn: boolean } }) => state.auth
  );
  const location = useLocation();

  useEffect(() => {
    console.log("isLoggedIn", isLoggedIn);
    // Check if the user is not logged in and redirect to the login page
    if (!isLoggedIn) {
      <Navigate to={pathRoute.loginPagePath} replace={true} />;
    }
  }, [isLoggedIn, location]);

  // Redirect to login if not authenticated
  return isLoggedIn ? <Outlet /> : <Navigate to={pathRoute.loginPagePath} />;
};
