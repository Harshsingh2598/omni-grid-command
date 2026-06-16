import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => (
  <nav className="navbar">
    <h1>SmartCity AI Command Center</h1>
    <div>
      <Link to="/assistant">AI Assistant</Link>
    </div>
  </nav>
);

export default Navbar;
