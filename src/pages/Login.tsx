// src/pages/Login.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextInput, Container, Paper, Title } from '@mantine/core';
import { useAuthStore } from '../store/app.store';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = () => {
    // Mock login, no validation for username/password since it's frontend only
    if (username && password) {
      login(); // Call login function from Zustand store
      navigate('/private/spacexresourcelistpage'); // Redirect to private page after login
    } else {
      alert('Please enter username and password');
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
