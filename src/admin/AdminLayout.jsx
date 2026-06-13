import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BedDouble, LogOut, Hotel, Globe, ShoppingBag } from 'lucide-react';
import './admin.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  // Simulador de Roles
  const [role, setRole] = useState('Gerente'); // Roles: 'Recepción', 'Gerente'

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-brand" onClick={() => navigate('/')}>
          <Hotel size={24} className="admin-brand-icon" />
          <div>
            <h2 className="admin-brand-title">Terranova</h2>
            <span className="admin-brand-subtitle">PMS ADMIN</span>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className={({isActive}) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/reception" className={({isActive}) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Users size={20} />
            <span>Recepción (In/Out)</span>
          </NavLink>
          <NavLink to="/admin/rooms" className={({isActive}) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <BedDouble size={20} />
            <span>Habitaciones & Aseo</span>
          </NavLink>
          <NavLink to="/admin/inventory" className={({isActive}) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <ShoppingBag size={20} />
            <span>Inventario</span>
          </NavLink>
          
          {/* Módulo Exclusivo para Gerente */}
          {role === 'Gerente' && (
            <NavLink to="/admin/website" className={({isActive}) => `admin-nav-link ${isActive ? 'active' : ''}`}>
              <Globe size={20} />
              <span>Gestor Web (CMS)</span>
            </NavLink>
          )}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={() => navigate('/')}>
            <LogOut size={20} />
            <span>Salir al Sitio</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <header className="admin-header">
          <h1 className="admin-page-title">Sistema de Gestión</h1>
          <div className="admin-user-info">
            {/* Simulador de Cambio de Rol */}
            <div className="role-selector" style={{ marginRight: '15px' }}>
              <label style={{ fontSize: '0.8rem', color: '#7f8fa6', marginRight: '5px' }}>Simular Rol:</label>
              <select 
                value={role} 
                onChange={(e) => {
                  setRole(e.target.value);
                  if(e.target.value !== 'Gerente') navigate('/admin'); // Redirect si pierde permiso
                }}
                className="admin-select"
                style={{ padding: '5px', width: 'auto' }}
              >
                <option value="Recepción">Recepción</option>
                <option value="Gerente">Gerente</option>
              </select>
            </div>

            <span className="admin-user-role">{role} Shift 1</span>
            <div className="admin-avatar">{role.charAt(0)}</div>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
