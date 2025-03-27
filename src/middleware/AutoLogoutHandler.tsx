import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../Redux/AuthSlice";

const AutoLogoutHandler = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAutoLogout = () => {
      const loginTime = localStorage.getItem("wallpaper_login_time");
      if (!loginTime) return;

      const currentTime = Date.now();
      const elapsedTime = currentTime - parseInt(loginTime, 10);

      if (elapsedTime >= 15 * 60 * 1000) {
        dispatch(logout());
      } else {
        // Auto logout after remaining time
        const remainingTime = 15 * 60 * 1000 - elapsedTime;
        setTimeout(() => dispatch(logout()), remainingTime);
      }
    };

    checkAutoLogout();

    // Check periodically in case the user refreshes the page
    const interval = setInterval(checkAutoLogout, 60 * 1000); // Every 1 min

    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
};

export default AutoLogoutHandler;