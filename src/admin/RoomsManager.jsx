import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { Plus, Trash2 } from 'lucide-react';

export default function RoomsManager() {
  const { rooms, updateRoomStatus, updateCleanStatus, toggleOnlineStatus, addPhysicalRoom, deletePhysicalRoom } = useAdmin();

  const [newRoomId, setNewRoomId] = useState('');
  const [newRoomType, setNewRoomType] = useState('Estándar');

  const handleAddRoom = (e) => {
    e.preventDefault();
    if (!newRoomId) return;
    const success = addPhysicalRoom({ id: newRoomId, type: newRoomType });
    if (success) {
      setNewRoomId('');
      setNewRoomType('Estándar');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(`¿Está seguro de eliminar la habitación ${id}?`)) {
      deletePhysicalRoom(id);
    }
  };

  return (
    <div className="admin-rooms-manager">
      <div className="admin-panel mb-4">
        <div className="admin-panel-header">
          <h2><Plus size={20} className="inline mr-2"/> Registrar Nueva Habitación Física</h2>
        </div>
        <form className="admin-form" onSubmit={handleAddRoom}>
          <div className="grid-2-cols">
            <div className="form-group">
              <label>Número de Habitación</label>
              <input type="number" className="admin-input" required placeholder="Ej. 401" value={newRoomId} onChange={e=>setNewRoomId(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Tipo de Habitación (Categoría CMS)</label>
              <select className="admin-select" value={newRoomType} onChange={e=>setNewRoomType(e.target.value)}>
                <option value="Estándar">Estándar</option>
                <option value="Doble Superior">Doble Superior</option>
                <option value="Suite Principal">Suite Principal</option>
                <option value="Familiar">Familiar</option>
              </select>
            </div>
          </div>
          <button type="submit" className="admin-btn admin-btn-primary mt-2">Crear Habitación</button>
        </form>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Estado de Habitaciones Físicas</h2>
          <div className="status-legend">
            <span className="legend-item"><span className="dot bg-green"></span> Disponible</span>
            <span className="legend-item"><span className="dot bg-blue"></span> Ocupada</span>
            <span className="legend-item"><span className="dot bg-red"></span> Mantenimiento</span>
            <span className="legend-item"><span className="dot bg-yellow"></span> Sucia</span>
          </div>
        </div>

        <div className="rooms-grid">
          {rooms.map(room => (
            <div key={room.id} className={`room-admin-card status-${room.status} clean-${room.cleanStatus}`}>
              <div className="room-card-header">
                <h3>Hab. {room.id}</h3>
                <span className="room-type">{room.type}</span>
              </div>
              
              <div className="room-controls">
                <div className="control-group">
                  <label>Ocupación:</label>
                  <select 
                    value={room.status}
                    onChange={(e) => updateRoomStatus(room.id, e.target.value)}
                    className="admin-select"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="ocupada">Ocupada</option>
                    <option value="mantenimiento">Mantenimiento</option>
                  </select>
                </div>

                <div className="control-group">
                  <label>Aseo:</label>
                  <select 
                    value={room.cleanStatus}
                    onChange={(e) => updateCleanStatus(room.id, e.target.value)}
                    className="admin-select"
                  >
                    <option value="limpia">Limpia</option>
                    <option value="sucia">Sucia</option>
                  </select>
                </div>

                <div className="control-group switch-group">
                  <label>Reserva Online:</label>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={room.isOnline} 
                      onChange={() => toggleOnlineStatus(room.id)}
                    />
                    <span className="slider round"></span>
                  </label>
                  <span className={`status-text ${room.isOnline ? 'text-green' : 'text-red'}`}>
                    {room.isOnline ? 'Activa' : 'Bloqueada'}
                  </span>
                </div>
              </div>

              <div style={{borderTop: '1px solid #dcdde1', marginTop: '10px', paddingTop: '10px', textAlign: 'right'}}>
                <button 
                  className="admin-btn admin-btn-danger" 
                  style={{fontSize: '0.75rem', padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px'}}
                  onClick={() => handleDelete(room.id)}
                >
                  <Trash2 size={12}/> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
