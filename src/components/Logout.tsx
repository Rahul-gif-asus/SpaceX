import { Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/app.store'; // Import Zustand store

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore(); // Get logout function from Zustand

  const handleLogout = () => {
    // Call Zustand logout which clears the auth state and localStorage, and sets logoutInitiated to true
    logout(); 
    
    // Show logout notification
    showNotification({
      title: 'Logout Successful',
      message: 'You have successfully logged out. Redirecting to login page...',
      color: 'green',
      autoClose: 2500,
    });

    // Redirect to login page after delay
    setTimeout(() => {
      navigate('/login');
    }, 2500);
  };

  return (
    <Button 
      variant="outline" 
      color="red" 
      onClick={handleLogout} 
      style={{
        position: 'absolute',
        top: '20px', 
        right: '2rem', 
        zIndex: 1000, // Ensures button appears on top of everything
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
