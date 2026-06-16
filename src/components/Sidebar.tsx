import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside className="cyber-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="sidebar-logo"></div>
        <span className="sidebar-title">OMNI-GRID COMMAND</span>
      </div>

      {/* Nav Menu Links */}
      <nav className="nav-links">
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span style={{ fontSize: '1.1rem' }}>🌐</span>
          <span>Command Center</span>
        </NavLink>
        
        <NavLink to="/traffic" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span style={{ fontSize: '1.1rem' }}>🚗</span>
          <span>Traffic Intel</span>
        </NavLink>
        
        <NavLink to="/pollution" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span style={{ fontSize: '1.1rem' }}>🍃</span>
          <span>Pollution & AQI</span>
        </NavLink>
        
        <NavLink to="/energy" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span style={{ fontSize: '1.1rem' }}>⚡</span>
          <span>Energy Forecast</span>
        </NavLink>
        
        <NavLink to="/emergency" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span style={{ fontSize: '1.1rem' }}>🚨</span>
          <span>Emergency Risk</span>
        </NavLink>
        
        <NavLink to="/assistant" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span style={{ fontSize: '1.1rem' }}>🤖</span>
          <span>AI Assistant</span>
        </NavLink>
      </nav>

      {/* Decorative footer indicator */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '1px', textTransform: 'uppercase' }}>System Version</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>v3.42.0 (Stable)</div>
      </div>
    </aside>
  );
};

export default Sidebar;
