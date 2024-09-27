import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/app.store';
import { showNotification } from '@mantine/notifications';
import { useEffect } from 'react';

const PrivateRoute = () => {
  const { isAuthenticated, logoutInitiated } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    logoutInitiated: state.logoutInitiated,
  }));

  useEffect(() => {
    if (!isAuthenticated && !logoutInitiated) {
      showNotification({
        title: 'Access Denied',
        message: 'Please log in to access the requested page.',
        color: 'yellow',
        autoClose: 3000,
        withCloseButton: true,
      });
    }
  }, [isAuthenticated, logoutInitiated]);

  // Allow access if authenticated or in the process of logging out
  return isAuthenticated ? (
    <Outlet /> // Render child routes if authenticated
  ) : (
    !logoutInitiated && (
      <Navigate
        to="/login"
        state={{ from: window.location.pathname }} // Send the route they tried to access
        replace
      />
    )
  );
};

export default PrivateRoute;
