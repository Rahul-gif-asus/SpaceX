import { Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth tokens from local storage or session storage
    localStorage.removeItem('isAuthenticated'); // Remove token from local storage
   
    
    
    // Show a logout notification
    showNotification({
      title: 'Logout Successful',
      message: 'You have successfully logged out. Redirecting to login page...',
      color: 'green',
      autoClose: 2500,
    });

    // Redirect to login page after a small delay
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
        right: '20px', 
        zIndex: 1000, // Ensures button appears on top of everything
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
