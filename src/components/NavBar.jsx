import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export function NavBar() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');
    try {
      if (token) await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    } catch {
      // Clear the local demo session even if the API is unavailable.
    } finally {
      localStorage.removeItem('authToken');
      navigate('/login');
    }
  };

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Link to="/dashboard" className="brand" aria-label="Northstar home"><span className="brand-mark" aria-hidden="true">N</span><span>northstar<span className="brand-period">.</span></span></Link>
        <nav className="nav" aria-label="Main navigation">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Overview</NavLink>
          <NavLink to="/transfer" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Transfer</NavLink>
          <NavLink to="/history" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Activity</NavLink>
        </nav>
        <button className="signout-button" type="button" onClick={handleLogout}><span className="avatar" aria-hidden="true">S</span><span>Sign out</span></button>
      </div>
    </header>
  );
}
