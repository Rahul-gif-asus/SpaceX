// src/pages/PrivatePage.tsx

import React from 'react';
import { useAuthStore } from '../store/app.store';

const PrivatePage: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <div>
      <h2>Private Page</h2>
      <p>This page is only accessible to authenticated users.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default PrivatePage;
