import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { Package, Plus, Trash2, Edit2, ShoppingBag } from 'lucide-react';

export default function InventoryManager() {
  const { inventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useAdmin();
  
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemStock, setNewItemStock] = useState('');
  const [newItemType, setNewItemType] = useState('product');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    
    addInventoryItem({
      name: newItemName,
      price: parseInt(newItemPrice.replace(/[^0-9]/g, '')),
      stock: newItemType === 'product' ? parseInt(newItemStock) || 0 : null,
      type: newItemType
    });
    
    setNewItemName('');
    setNewItemPrice('');
    setNewItemStock('');
  };

  const handleAddStock = (id, currentStock) => {
    const qty = parseInt(prompt(`Stock actual: ${currentStock}. ¿Cuántas unidades nuevas vas a añadir?`, "0"));
    if (qty && !isNaN(qty)) {
      updateInventoryItem(id, { stock: currentStock + qty });
    }
  };

  const products = inventoryItems.filter(i => i.type === 'product');
  const services = inventoryItems.filter(i => i.type === 'service');

  return (
    <div className="admin-inventory-manager">
      <div className="admin-panel mb-4">
        <div className="admin-panel-header">
          <h2><Plus size={20} className="inline mr-2"/> Registrar Nuevo Ítem</h2>
        </div>
        <form className="admin-form" onSubmit={handleAddItem}>
          <div className="grid-2-cols">
            <div className="form-group">
              <label>Tipo de Ítem</label>
              <select className="admin-select" value={newItemType} onChange={e=>setNewItemType(e.target.value)}>
                <option value="product">Producto Físico (Requiere Stock)</option>
                <option value="service">Servicio Extra (Stock Ilimitado)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nombre</label>
              <input type="text" className="admin-input" required placeholder="Ej. Botella de Agua" value={newItemName} onChange={e=>setNewItemName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Precio de Venta (COP)</label>
              <input type="text" className="admin-input" required placeholder="Ej. 3000" value={newItemPrice} onChange={e=>setNewItemPrice(e.target.value)} />
            </div>
            {newItemType === 'product' && (
              <div className="form-group">
                <label>Stock Inicial</label>
                <input type="number" className="admin-input" required min="0" placeholder="Ej. 24" value={newItemStock} onChange={e=>setNewItemStock(e.target.value)} />
              </div>
            )}
          </div>
          <button type="submit" className="admin-btn admin-btn-primary mt-2">Guardar Ítem</button>
        </form>
      </div>

      <div className="grid-2-cols">
        {/* TABLA DE PRODUCTOS FÍSICOS */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h3><Package size={18} className="inline mr-2"/> Productos Físicos</h3>
          </div>
          <div className="list-group">
            {products.length === 0 ? <p className="text-muted text-sm p-2">No hay productos registrados.</p> : products.map(item => (
              <div key={item.id} className="list-item-card flex justify-between items-center" style={{padding: '10px 15px', borderBottom: '1px solid #eee'}}>
                <div>
                  <h4 style={{margin: '0 0 5px 0', fontSize: '14px'}}>{item.name}</h4>
                  <p style={{margin: 0, fontSize: '12px', color: '#666'}}>Precio: ${item.price.toLocaleString()} COP</p>
                  <p style={{margin: '2px 0 0 0', fontSize: '12px', fontWeight: 'bold', color: item.stock <= 5 ? '#c23616' : '#166534'}}>
                    Stock: {item.stock} uds.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="admin-btn" style={{padding: '5px 10px', fontSize: '11px', backgroundColor: '#e1b12c', color: '#fff'}} onClick={() => handleAddStock(item.id, item.stock)}>
                    + Stock
                  </button>
                  <button className="admin-btn admin-btn-danger" style={{padding: '5px 10px', fontSize: '11px'}} onClick={() => deleteInventoryItem(item.id)}>
                    <Trash2 size={12}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TABLA DE SERVICIOS */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h3><ShoppingBag size={18} className="inline mr-2"/> Servicios Extras</h3>
          </div>
          <div className="list-group">
            {services.length === 0 ? <p className="text-muted text-sm p-2">No hay servicios registrados.</p> : services.map(item => (
              <div key={item.id} className="list-item-card flex justify-between items-center" style={{padding: '10px 15px', borderBottom: '1px solid #eee'}}>
                <div>
                  <h4 style={{margin: '0 0 5px 0', fontSize: '14px'}}>{item.name}</h4>
                  <p style={{margin: 0, fontSize: '12px', color: '#666'}}>Precio: ${item.price.toLocaleString()} COP</p>
                </div>
                <div className="flex gap-2">
                  <button className="admin-btn admin-btn-danger" style={{padding: '5px 10px', fontSize: '11px'}} onClick={() => deleteInventoryItem(item.id)}>
                    <Trash2 size={12}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
