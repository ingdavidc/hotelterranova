import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Contexts
import { SiteContentProvider } from './context/SiteContentContext.jsx';
import { AdminProvider } from './admin/AdminContext.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import Dashboard from './admin/Dashboard.jsx';
import Reception from './admin/Reception.jsx';
import RoomsManager from './admin/RoomsManager.jsx';
import SiteManager from './admin/SiteManager.jsx';
import InventoryManager from './admin/InventoryManager.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteContentProvider>
      <AdminProvider>
        <BrowserRouter>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<App />} />
            
            {/* Rutas de Administración */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="reception" element={<Reception />} />
              <Route path="rooms" element={<RoomsManager />} />
              <Route path="inventory" element={<InventoryManager />} />
              <Route path="website" element={<SiteManager />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </SiteContentProvider>
  </StrictMode>,
)
