import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Index from "../pages/Admin/Index";
import Create from "../pages/Admin/AddImage";
import Login from "../pages/Aauth/Login";
import Register from "../pages/Aauth/Register";
import AuthGuard from "../Guards/AuthGuard";
import HomeLayout from "../layout/Layout";
import AuthRedirectGuard from "../Guards/AuthRedirectGuard";

const MainRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route  */}
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Admin Route  */}
        <Route element={<AuthGuard />}>
          <Route element={<HomeLayout />}>
            <Route path="/admin" element={<Index />} />
            <Route path="/create" element={<Create />} />
          </Route>
        </Route>

        {/* Auth Rotues  */}
        <Route element={<AuthRedirectGuard />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default MainRoutes;
