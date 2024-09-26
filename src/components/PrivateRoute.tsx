import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/app.store';

const PrivateRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? (
    <Outlet /> // Render child routes if authenticated
  ) : (
    // Pass the current location in state when redirecting to login
    <Navigate
      to="/login"
      state={{ from: window.location.pathname }} // Send the route they tried to access
      replace
    />
  );
};

export default PrivateRoute;
