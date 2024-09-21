import React from 'react';
import { Outlet } from 'react-router-dom';
// App.tsx
import './App.scss'; // or './style.scss', depending on your setup

const App: React.FC = () => {
  return (
    <div>

      <Outlet /> {/* This renders the child routes */}
    </div>
  );
};

export default App;
