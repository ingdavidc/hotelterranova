import React from 'react';
import { useAdmin } from './AdminContext';
import { Users, CheckCircle, Clock, AlertTriangle, DollarSign, TrendingUp, CreditCard } from 'lucide-react';

export default function Dashboard() {
  const { rooms, salesHistory } = useAdmin();

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === 'ocupada').length;
  const availableRooms = rooms.filter(r => r.status === 'disponible' && r.cleanStatus === 'limpia').length;
  const dirtyRooms = rooms.filter(r => r.cleanStatus === 'sucia').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'mantenimiento').length;

  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Calculo de finanzas de hoy (Simulado considerando todo salesHistory como hoy por simplicidad del prototipo)
  const totalRevenue = salesHistory.reduce((sum, sale) => sum + sale.amount, 0);
  
  // Cuentas por cobrar (Consumos pendientes en habitaciones ocupadas + Hospedaje si no ha pagado, pero el hospedaje asumimos que lo pagó)
  let pendingReceivables = 0;
  rooms.filter(r => r.status === 'ocupada').forEach(room => {
    if (room.extras) {
      pendingReceivables += room.extras.filter(e => !e.isPaid).reduce((sum, e) => sum + parseInt(e.amount), 0);
    }
  });

  // Top productos vendidos (basado en descripción, simplificado)
  const productSales = {};
  salesHistory.filter(s => s.type === 'consumo').forEach(sale => {
    productSales[sale.description] = (productSales[sale.description] || 0) + 1;
  });
  const topProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="admin-dashboard">
      {/* TARJETAS FINANCIERAS */}
      <div className="grid-2-cols mb-4">
        <div className="admin-panel flex items-center justify-between" style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none'}}>
          <div>
            <h3 style={{margin: '0 0 5px 0', fontSize: '16px', fontWeight: 'normal', opacity: 0.9}}>Ingresos del Día</h3>
            <h1 style={{margin: 0, fontSize: '32px'}}>${totalRevenue.toLocaleString()} COP</h1>
            <p style={{margin: '5px 0 0 0', fontSize: '12px', opacity: 0.8}}>{salesHistory.length} transacciones registradas</p>
          </div>
          <DollarSign size={64} opacity={0.3} />
        </div>
        
        <div className="admin-panel flex items-center justify-between" style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', border: 'none'}}>
          <div>
            <h3 style={{margin: '0 0 5px 0', fontSize: '16px', fontWeight: 'normal', opacity: 0.9}}>Cuentas por Cobrar (Pendientes)</h3>
            <h1 style={{margin: 0, fontSize: '32px'}}>${pendingReceivables.toLocaleString()} COP</h1>
            <p style={{margin: '5px 0 0 0', fontSize: '12px', opacity: 0.8}}>De huéspedes actualmente alojados</p>
          </div>
          <CreditCard size={64} opacity={0.3} />
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon bg-blue"><Users size={24}/></div>
          <div className="admin-stat-info">
            <h3>Ocupación</h3>
            <p>{occupancyRate}% ({occupiedRooms}/{totalRooms})</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon bg-green"><CheckCircle size={24}/></div>
          <div className="admin-stat-info">
            <h3>Disponibles</h3>
            <p>{availableRooms}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon bg-yellow"><Clock size={24}/></div>
          <div className="admin-stat-info">
            <h3>Requieren Aseo</h3>
            <p>{dirtyRooms}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon bg-red"><AlertTriangle size={24}/></div>
          <div className="admin-stat-info">
            <h3>Mantenimiento</h3>
            <p>{maintenanceRooms}</p>
          </div>
        </div>
      </div>

      <div className="grid-2-cols mt-4">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2>Huéspedes Actuales</h2>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Habitación</th>
                <th>Huésped</th>
                <th>Salida</th>
                <th>Deuda Extras</th>
              </tr>
            </thead>
            <tbody>
              {rooms.filter(r => r.status === 'ocupada').map(room => {
                const pending = room.extras ? room.extras.filter(e => !e.isPaid).reduce((s, e) => s + parseInt(e.amount), 0) : 0;
                return (
                <tr key={room.id}>
                  <td><strong>{room.id}</strong></td>
                  <td>{room.guest}</td>
                  <td>{room.checkout}</td>
                  <td>{pending > 0 ? <span className="text-red font-bold">${pending.toLocaleString()}</span> : <span className="text-green">Al día</span>}</td>
                </tr>
              )})}
              {occupiedRooms === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">No hay huéspedes actuales.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2><TrendingUp size={18} className="inline mr-2"/> Top Consumos Hoy</h2>
          </div>
          {topProducts.length === 0 ? (
            <p className="text-muted text-sm text-center p-4">Aún no hay ventas de productos o servicios registrados hoy.</p>
          ) : (
            <div className="list-group">
              {topProducts.map(([name, qty], idx) => (
                <div key={name} className="list-item-card flex justify-between items-center" style={{padding: '10px 15px'}}>
                  <div className="flex items-center gap-3">
                    <div style={{width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold'}}>{idx + 1}</div>
                    <strong>{name}</strong>
                  </div>
                  <span className="badge" style={{backgroundColor: '#e1f5fe', color: '#0288d1'}}>{qty} ventas</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
