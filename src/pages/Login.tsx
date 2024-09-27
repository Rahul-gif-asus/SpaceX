import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, TextInput, Container, Paper, Title } from '@mantine/core';
import { showNotification, cleanNotifications } from '@mantine/notifications'; // Import cleanNotifications
import { useAuthStore } from '../store/auth.store';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Zustand store for managing auth state
  const { isAuthenticated, login } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    login: state.login,
  }));

  // Check if the user was redirected from a private route
  useEffect(() => {
    if (location.state?.from && !isAuthenticated) {
      // Clean any existing notifications to avoid duplication
      cleanNotifications();

      // Show the "Access Denied" notification if redirected
      showNotification({
        id: 'redirected-login', // Unique ID to avoid duplication
        title: 'Access Denied',
        message: 'Please log in to access the requested page.',
        color: 'yellow',
        autoClose: 3000, // Automatically close after 3 seconds
        withCloseButton: false,
      });
    }
  }, [location.state?.from, isAuthenticated]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Clear any previous notifications
      cleanNotifications();

      // Show notification that user is already logged in
      showNotification({
        id: 'already-logged-in', // Unique ID to prevent duplicate notifications
        title: 'Already Logged In',
        message: 'You are already logged in, redirecting to SpaceX Resource List page.',
        color: 'blue',
        autoClose: 3000, // Automatically close after 3 seconds
        withCloseButton: false,
      });

      // Redirect to the resource list page
      navigate('/private/spacexresourcelistpage'); // Redirect to private page if logged in
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = () => {
    if (username && password) {
      login(); // Call login function from Zustand store

      showNotification({
        title: 'Login Successful',
        message: `Welcome, ${username}! You have successfully logged in.`,
        color: 'green',
        autoClose: 3000, // Automatically close after 3 seconds
        withCloseButton: false,
      });

      navigate('/private/spacexresourcelistpage'); // Redirect to private page after login
    } else {
      showNotification({
        title: 'Login Failed',
        message: 'Please enter both username and password.',
        color: 'red',
        autoClose: 3000, 
        withCloseButton: false,
      });
    }
  };

  return (
    <Container>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title align="center">Login</Title>
        <TextInput
          label="Username"
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
        />
        <TextInput
          label="Password"
          placeholder="Your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          mt="md"
        />
        <Button fullWidth mt="xl" onClick={handleSubmit}>
          Login
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;
