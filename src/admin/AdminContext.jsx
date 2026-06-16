import React, { createContext, useState, useContext } from 'react';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  // Mock Data: Habitaciones
  const [rooms, setRooms] = useState([
    { id: 101, type: 'Estándar', status: 'disponible', cleanStatus: 'limpia', isOnline: true },
    { id: 102, type: 'Estándar', status: 'ocupada', cleanStatus: 'sucia', isOnline: true, guest: 'Juan Pérez', checkout: 'Mañana' },
    { id: 103, type: 'Estándar', status: 'mantenimiento', cleanStatus: 'limpia', isOnline: false },
    { id: 201, type: 'Doble Superior', status: 'disponible', cleanStatus: 'limpia', isOnline: true },
    { id: 202, type: 'Doble Superior', status: 'ocupada', cleanStatus: 'limpia', isOnline: true, guest: 'María Gómez', checkout: 'Hoy' },
    { id: 301, type: 'Suite Terranova', status: 'disponible', cleanStatus: 'limpia', isOnline: true },
  ]);

  // Inventario de Productos y Servicios
  const [inventoryItems, setInventoryItems] = useState([
    { id: 1, name: 'Agua en Botella', price: 3000, stock: 50, type: 'product' },
    { id: 2, name: 'Gaseosa Cola', price: 4000, stock: 30, type: 'product' },
    { id: 3, name: 'Servicio de Lavandería', price: 15000, stock: null, type: 'service' }, // null stock for services
  ]);

  // Historial de Ventas e Ingresos
  const [salesHistory, setSalesHistory] = useState([]);

  // --- LOGICA DE HISTORIAL ---
  const registerSale = (description, amount, type = 'otro', roomId = null) => {
    setSalesHistory(prev => [...prev, {
      id: Date.now(),
      date: new Date().toISOString(),
      description,
      amount: parseInt(amount) || 0,
      type,
      roomId
    }]);
  };

  // --- LOGICA DE INVENTARIO ---
  const addInventoryItem = (item) => {
    setInventoryItems([...inventoryItems, { ...item, id: Date.now() }]);
  };

  const updateInventoryItem = (id, updatedItem) => {
    setInventoryItems(inventoryItems.map(i => i.id === id ? { ...i, ...updatedItem } : i));
  };

  const deleteInventoryItem = (id) => {
    setInventoryItems(inventoryItems.filter(i => i.id !== id));
  };

  const deductStock = (id, quantity = 1) => {
    setInventoryItems(inventoryItems.map(i => {
      if (i.id === id && i.type === 'product' && i.stock !== null) {
        return { ...i, stock: Math.max(0, i.stock - quantity) };
      }
      return i;
    }));
  };

  // --- LOGICA DE HABITACIONES FISICAS ---
  const addPhysicalRoom = (newRoom) => {
    if (rooms.find(r => r.id === parseInt(newRoom.id))) {
      alert('Ya existe una habitación con ese número.');
      return false;
    }
    setRooms([...rooms, { 
      id: parseInt(newRoom.id), 
      type: newRoom.type, 
      status: 'disponible', 
      cleanStatus: 'limpia', 
      isOnline: true 
    }]);
    return true;
  };

  const editPhysicalRoom = (roomId, updatedData) => {
    setRooms(rooms.map(r => r.id === roomId ? { ...r, ...updatedData } : r));
  };

  const deletePhysicalRoom = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (room && room.status === 'ocupada') {
      alert('No puedes eliminar una habitación que está actualmente ocupada.');
      return false;
    }
    setRooms(rooms.filter(r => r.id !== roomId));
    return true;
  };

  const updateRoomStatus = (roomId, newStatus) => {
    setRooms(rooms.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
  };

  const updateCleanStatus = (roomId, newStatus) => {
    setRooms(rooms.map(r => r.id === roomId ? { ...r, cleanStatus: newStatus } : r));
  };

  const toggleOnlineStatus = (roomId) => {
    setRooms(rooms.map(r => r.id === roomId ? { ...r, isOnline: !r.isOnline } : r));
  };

  const checkIn = (roomId, guestName, checkoutDate, amount, paymentMethod, transactionCode, inventoryData, guestDetails) => {
    const wifiPin = Math.floor(100000 + Math.random() * 900000).toString();

    setRooms(rooms.map(r => r.id === roomId ? { 
      ...r, 
      status: 'ocupada', 
      guest: guestName, 
      checkout: checkoutDate,
      checkinDate: new Date().toISOString(),
      amountPaid: amount,
      paymentMethod: paymentMethod,
      transactionCode: transactionCode,
      wifiPin: wifiPin,
      inventory: inventoryData || {},
      extras: [], 
      guestDetails: guestDetails || {}
    } : r));
  };

  const addExtraCharge = (roomId, inventoryItemId, description, extraAmount, isPaid) => {
    // Si es un producto del inventario físico, descontamos el stock
    if (inventoryItemId) {
      deductStock(inventoryItemId, 1);
    }

    // Si lo paga inmediatamente, lo registramos como ingreso en el acto
    if (isPaid) {
      registerSale(description, extraAmount, 'consumo', roomId);
    }

    setRooms(rooms.map(r => {
      if (r.id === roomId) {
        const currentExtras = r.extras || [];
        return { 
          ...r, 
          extras: [...currentExtras, { id: Date.now(), description, amount: extraAmount, isPaid }] 
        };
      }
      return r;
    }));
  };

  const checkOut = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      // Registrar el ingreso por hospedaje
      if (room.amountPaid) {
        // Remove currency symbols and dots if they exist, to parse to number
        let parsedAmount = room.amountPaid;
        if (typeof parsedAmount === 'string') {
           parsedAmount = parsedAmount.replace(/[^0-9]/g, '');
        }
        registerSale(`Hospedaje Hab. ${roomId}`, parsedAmount, 'hospedaje', roomId);
      }
      
      // Registrar consumos pendientes que se cobran al hacer check-out
      if (room.extras && room.extras.length > 0) {
        room.extras.filter(e => !e.isPaid).forEach(extra => {
          registerSale(`Cobro Salida: ${extra.description} (Hab. ${roomId})`, extra.amount, 'consumo', roomId);
        });
      }
    }

    setRooms(rooms.map(r => r.id === roomId ? { 
      ...r, 
      status: 'disponible', 
      cleanStatus: 'sucia', 
      guest: null, 
      checkout: null,
      amountPaid: null,
      paymentMethod: null,
      transactionCode: null,
      wifiPin: null,
      inventory: null,
      extras: null,
      guestDetails: null
    } : r));
  };

  return (
    <AdminContext.Provider value={{
      rooms, 
      updateRoomStatus, 
      updateCleanStatus, 
      toggleOnlineStatus,
      addPhysicalRoom,
      editPhysicalRoom,
      deletePhysicalRoom,
      checkIn,
      addExtraCharge,
      checkOut,
      inventoryItems,
      addInventoryItem,
      updateInventoryItem,
      deleteInventoryItem,
      salesHistory
    }}>
      {children}
    </AdminContext.Provider>
  );
};
