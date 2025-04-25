import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="website-name">TravelLog</Link>
      </div>
      <div className="navbar-right">
        <Link to="/travel-logs" className="nav-link">Travel Logs</Link>
        <Link to="/journey-plans" className="nav-link">Journey Plans</Link>
      </div>
    </nav>
  );
};

export default Navbar;