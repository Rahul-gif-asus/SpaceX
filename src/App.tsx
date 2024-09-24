import React from 'react';
import { Outlet } from 'react-router-dom';
import './App.scss'; // Global styles

const App: React.FC = () => {
  return (
    <div>
      <Outlet /> {/* This renders the child routes */}
    </div>
  );
};

export default App;
