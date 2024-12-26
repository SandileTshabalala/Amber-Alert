import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Header from './components/Header';
import Sidebar from './components/SideBar';
import Dashboard from './components/Dashboard';
import ManageCases from './components/ManageCases';
import ManageEmployees from './components/ManageEmployees';
import Reports from './components/Reports';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import './App.css';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const { isAuthenticated } = useAuth(); // Access the authentication state from the context

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle); // Toggle the sidebar's open state
  };

  return (
    <Router>
      {/* Always show the Login route */}
      <Routes>
        <Route path="/admin-login" element={<Login />} />
        {isAuthenticated && (
          // Only render these routes if the user is authenticated
          <Route path="/*" element={<AuthenticatedApp openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />} />
        )}
        {!isAuthenticated && <Route path="/*" element={<Navigate to="/admin-login" />} />}
      </Routes>
    </Router>
  );
}

function AuthenticatedApp({ openSidebarToggle, OpenSidebar }) {
  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <main className="content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manage-cases" element={<ManageCases />} />
          <Route path="/manage-employees" element={<ManageEmployees />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          {/* Redirect all other paths to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
