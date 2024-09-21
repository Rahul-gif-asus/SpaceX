// src/pages/Login.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/app.store';

const Login: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate('/private');
  };

  return (
    <div>
      <h2>Login Page</h2>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;

