import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { Printer, Plus, ShoppingCart, CheckCircle, AlertTriangle, Smartphone } from 'lucide-react';

export default function Reception() {
  const { rooms, checkIn, checkOut, addExtraCharge, inventoryItems } = useAdmin();
  
  // Estados para Check-In (Hospedaje y Cobro)
  const [selectedRoom, setSelectedRoom] = useState('');
  const [guestName, setGuestName] = useState('');
  const [checkoutDate, setCheckoutDate] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [transactionCode, setTransactionCode] = useState('');
  
  // Estados para TRA (Datos Legales Colombia) y Contacto
  const [guestIdType, setGuestIdType] = useState('CC');
  const [guestIdNumber, setGuestIdNumber] = useState('');
  const [guestOrigin, setGuestOrigin] = useState('');
  const [guestTravelReason, setGuestTravelReason] = useState('Turismo');
  const [guestPhoneCode, setGuestPhoneCode] = useState('+57');
  const [guestPhone, setGuestPhone] = useState('');
  const [companions, setCompanions] = useState([]); // [{name: '', idType: 'CC', idNumber: ''}]

  // Estado de Inventario Entregado
  const [invTV, setInvTV] = useState(true);
  const [invAC, setInvAC] = useState(true);
  const [invKeys, setInvKeys] = useState(1);
  const [invOther, setInvOther] = useState('');

  // Estado para impresión
  const [printData, setPrintData] = useState(null);

  // Estados para Modal de Consumos Adicionales
  const [extraRoomId, setExtraRoomId] = useState(null);
  const [extraItemId, setExtraItemId] = useState('');
  const [extraDesc, setExtraDesc] = useState('');
  const [extraAmount, setExtraAmount] = useState('');
  const [extraIsPaid, setExtraIsPaid] = useState(false);

  // Estados para Ventana de Liquidación (Check-Out)
  const [checkoutRoom, setCheckoutRoom] = useState(null);
  const [retTV, setRetTV] = useState(false);
  const [retAC, setRetAC] = useState(false);
  const [retKeys, setRetKeys] = useState(false);

  const handleCheckIn = (e) => {
    e.preventDefault();
    if(selectedRoom && guestName && checkoutDate && amount && guestIdNumber && guestOrigin && guestPhone) {
      if(paymentMethod !== 'Efectivo' && !transactionCode) {
        alert('Por favor, ingrese el código de transacción para pagos electrónicos.');
        return;
      }

      const inventoryData = { tv: invTV, ac: invAC, keys: invKeys, other: invOther };
      const guestDetails = { 
        idType: guestIdType, 
        idNumber: guestIdNumber, 
        origin: guestOrigin, 
        travelReason: guestTravelReason,
        phoneCode: guestPhoneCode,
        phone: guestPhone,
        companions: companions 
      };

      checkIn(parseInt(selectedRoom), guestName, checkoutDate, amount, paymentMethod, transactionCode, inventoryData, guestDetails);
      
      // Reset Form
      setSelectedRoom(''); setGuestName(''); setCheckoutDate(''); setAmount('');
      setPaymentMethod('Efectivo'); setTransactionCode('');
      setGuestIdType('CC'); setGuestIdNumber(''); setGuestOrigin(''); setGuestTravelReason('Turismo');
      setGuestPhoneCode('+57'); setGuestPhone('');
      setCompanions([]);
      setInvTV(true); setInvAC(true); setInvKeys(1); setInvOther('');
      alert('Check-in realizado con éxito.');
    } else {
      alert('Por favor, complete todos los campos obligatorios del registro TRA, Contacto y Hospedaje.');
    }
  };

  const printVoucher = (room) => {
    setPrintData(room);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const sendWhatsAppVoucher = (room) => {
    if (!room.guestDetails || !room.guestDetails.phone) {
      alert('No hay un número de teléfono registrado para este huésped.');
      return;
    }
    const phone = `${room.guestDetails.phoneCode.replace('+', '')}${room.guestDetails.phone}`;
    const message = `¡Hola ${room.guest}! Bienvenido al Hotel Terranova. Nos alegra tenerte aquí. Tu habitación es la ${room.id}.\n\nComo beneficio exclusivo, aquí tienes tu PIN para WiFi Ilimitado: *${room.wifiPin}*\n\n¡Disfruta tu estadía!`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleAddExtra = (e) => {
    e.preventDefault();
    if(extraRoomId && extraDesc && extraAmount) {
      addExtraCharge(extraRoomId, extraItemId ? parseInt(extraItemId) : null, extraDesc, extraAmount, extraIsPaid);
      setExtraRoomId(null);
      setExtraItemId('');
      setExtraDesc('');
      setExtraAmount('');
      setExtraIsPaid(false);
    }
  };

  const confirmCheckOut = () => {
    if (!checkoutRoom) return;
    
    // Verificar si el inventario fue entregado y no se ha devuelto
    if (checkoutRoom.inventory?.tv && !retTV) return alert('Falta confirmar recepción del Control TV');
    if (checkoutRoom.inventory?.ac && !retAC) return alert('Falta confirmar recepción del Control AC');
    if (checkoutRoom.inventory?.keys > 0 && !retKeys) return alert('Falta confirmar recepción de las Llaves');

    checkOut(checkoutRoom.id);
    setCheckoutRoom(null);
    setRetTV(false); setRetAC(false); setRetKeys(false);
  };

  const availableRooms = rooms.filter(r => r.status === 'disponible' && r.cleanStatus === 'limpia');
  const occupiedRooms = rooms.filter(r => r.status === 'ocupada');

  return (
    <div className="admin-reception relative">
      {/* SECCIÓN OCULTA SOLO VISIBLE EN MODO IMPRESIÓN */}
      {printData && (
        <div className="print-voucher">
          <div className="voucher-header">
            <img src="/logo.png" alt="Hotel Terranova" className="voucher-logo" />
            <p>VOUCHER DE INGRESO</p>
          </div>
          <div className="voucher-body">
            <p><strong>Huésped:</strong> {printData.guest}</p>
            <p><strong>Habitación:</strong> {printData.id}</p>
            <p><strong>Check-out:</strong> {printData.checkout}</p>
            <div className="voucher-divider"></div>
            <p><strong>Total:</strong> {printData.amountPaid}</p>
            <p><strong>Pago:</strong> {printData.paymentMethod}</p>
            {printData.transactionCode && <p><strong>Ref:</strong> {printData.transactionCode}</p>}
            <div className="wifi-box">
              <p>WIFI: <strong>Terranova_Guest</strong></p>
              <div className="wifi-pin" style={{ color: '#000', fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>
                {printData.wifiPin}
              </div>
            </div>
          </div>
          <div className="voucher-footer">
            <p>¡Disfruta tu estadía!</p>
          </div>
        </div>
      )}

      {/* MODAL DE LIQUIDACIÓN DE CHECK-OUT */}
      {checkoutRoom && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h2>Liquidación de Check-Out: Hab. {checkoutRoom.id}</h2>
            <p>Huésped: <strong>{checkoutRoom.guest}</strong></p>
            <hr className="my-4"/>
            
            <div className="grid-2-cols">
              <div>
                <h4 className="flex items-center gap-2"><CheckCircle size={16}/> Auditoría de Inventario</h4>
                <p className="text-sm text-gray mb-2">Marque los elementos devueltos:</p>
                <div className="flex flex-col gap-2">
                  {checkoutRoom.inventory?.tv && (
                    <label className="flex items-center gap-2"><input type="checkbox" checked={retTV} onChange={e=>setRetTV(e.target.checked)}/> Control de TV</label>
                  )}
                  {checkoutRoom.inventory?.ac && (
                    <label className="flex items-center gap-2"><input type="checkbox" checked={retAC} onChange={e=>setRetAC(e.target.checked)}/> Control de AC</label>
                  )}
                  {checkoutRoom.inventory?.keys > 0 && (
                    <label className="flex items-center gap-2"><input type="checkbox" checked={retKeys} onChange={e=>setRetKeys(e.target.checked)}/> {checkoutRoom.inventory.keys} Llaves</label>
                  )}
                  {checkoutRoom.inventory?.other && (
                    <p className="text-sm">Otros entregados: {checkoutRoom.inventory.other}</p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="flex items-center gap-2"><ShoppingCart size={16}/> Consumos</h4>
                {(!checkoutRoom.extras || checkoutRoom.extras.length === 0) ? (
                  <p className="text-sm text-gray">No hay cargos adicionales.</p>
                ) : (
                  <ul className="text-sm">
                    {checkoutRoom.extras.map(ex => (
                      <li key={ex.id} className="flex justify-between border-b border-gray py-1">
                        <span>{ex.description} {ex.isPaid ? <span style={{color: 'green', fontSize: '10px'}}>(PAGADO)</span> : ''}</span>
                        <strong>{ex.amount}</strong>
                      </li>
                    ))}
                  </ul>
                )}
                {checkoutRoom.extras?.some(ex => !ex.isPaid) && (
                  <div className="mt-2 bg-yellow p-2 rounded flex justify-between items-center text-sm" style={{backgroundColor: '#fff9e6', border: '1px solid #e1b12c'}}>
                    <span className="font-bold flex items-center gap-1"><AlertTriangle size={14}/> Cobrar consumos pendientes antes de salir</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="admin-btn admin-btn-danger" onClick={confirmCheckOut}>Confirmar Check-Out y Liberar</button>
              <button className="admin-btn" style={{backgroundColor: '#ccc'}} onClick={() => {
                setCheckoutRoom(null); setRetTV(false); setRetAC(false); setRetKeys(false);
              }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONSUMOS EXTRAS */}
      {extraRoomId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{maxWidth: '400px'}}>
            <h2>Añadir Consumo: Hab. {extraRoomId}</h2>
            <form onSubmit={handleAddExtra} className="mt-4">
              <div className="form-group">
                <label>Seleccionar Producto/Servicio del Inventario</label>
                <select 
                  className="admin-select"
                  value={extraItemId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setExtraItemId(id);
                    if(id) {
                      const item = inventoryItems.find(i => i.id === parseInt(id));
                      if (item) {
                        setExtraDesc(item.name);
                        setExtraAmount(item.price);
                      }
                    } else {
                      setExtraDesc('');
                      setExtraAmount('');
                    }
                  }}
                >
                  <option value="">-- Seleccionar o escribir manualmente abajo --</option>
                  {inventoryItems.map(item => (
                    <option key={item.id} value={item.id} disabled={item.type === 'product' && item.stock <= 0}>
                      {item.name} (${item.price.toLocaleString()} COP) {item.type === 'product' ? `[Stock: ${item.stock}]` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Descripción (Manual)</label>
                <input type="text" required className="admin-input" placeholder="Ej. Minibar, Restaurante" value={extraDesc} onChange={e=>setExtraDesc(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Valor a Cobrar (COP)</label>
                <input type="text" required className="admin-input" placeholder="$0" value={extraAmount} onChange={e=>setExtraAmount(e.target.value)} />
              </div>
              <div className="form-group" style={{marginTop: '15px'}}>
                <label>Estado del Pago</label>
                <div style={{display: 'flex', gap: '15px', marginTop: '5px'}}>
                  <label style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                    <input type="radio" name="payStatus" checked={!extraIsPaid} onChange={() => setExtraIsPaid(false)} />
                    Pendiente (Cargar a habitación)
                  </label>
                  <label style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                    <input type="radio" name="payStatus" checked={extraIsPaid} onChange={() => setExtraIsPaid(true)} />
                    Pago Inmediato
                  </label>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="admin-btn admin-btn-primary">Añadir Cargo</button>
                <button type="button" className="admin-btn" style={{backgroundColor: '#ccc'}} onClick={() => setExtraRoomId(null)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INTERFAZ NORMAL */}
      <div className="grid-2-cols no-print">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2>Realizar Check-In</h2>
          </div>
          <form className="admin-form" onSubmit={handleCheckIn}>
            <div className="form-group">
              <label>Habitación Disponible (Limpia)</label>
              <select 
                value={selectedRoom} 
                onChange={(e) => setSelectedRoom(e.target.value)}
                required
                className="admin-input"
              >
                <option value="">Seleccione una habitación...</option>
                {availableRooms.map(r => (
                  <option key={r.id} value={r.id}>{r.id} - {r.type}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Fecha de Salida Prevista</label>
              <input 
                type="date" 
                className="admin-input" 
                value={checkoutDate}
                onChange={(e) => setCheckoutDate(e.target.value)}
                required
              />
            </div>

            {/* DATOS TRA (MINCIT) Y CONTACTO */}
            <div className="bg-gray-100 p-3 rounded mt-3 mb-3 border border-gray-200" style={{backgroundColor: '#f8f9fa'}}>
              <h4 className="text-sm mb-2" style={{color: '#2f3640', fontWeight: 'bold'}}>Datos de Registro (MinCIT - TRA)</h4>
              
              <div className="form-group mb-2">
                <label>Nombres y Apellidos del Titular</label>
                <input type="text" className="admin-input" value={guestName} onChange={(e) => setGuestName(e.target.value)} required placeholder="Ej. Carlos Martínez" />
              </div>

              <div className="flex gap-2 mb-2">
                <div className="form-group" style={{flex: 1}}>
                  <label>Tipo Documento</label>
                  <select className="admin-select" value={guestIdType} onChange={e=>setGuestIdType(e.target.value)}>
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="PA">Pasaporte</option>
                    <option value="PEP">Permiso Especial de Permanencia</option>
                  </select>
                </div>
                <div className="form-group" style={{flex: 2}}>
                  <label>Número de Documento</label>
                  <input type="text" className="admin-input" required value={guestIdNumber} onChange={e=>setGuestIdNumber(e.target.value)} />
                </div>
              </div>

              <div className="flex gap-2 mb-2">
                <div className="form-group" style={{flex: 1}}>
                  <label>País / Ciudad de Procedencia</label>
                  <input type="text" className="admin-input" placeholder="Ej. Colombia, Bogotá" required value={guestOrigin} onChange={e=>setGuestOrigin(e.target.value)} />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label>Motivo del Viaje</label>
                  <select className="admin-select" value={guestTravelReason} onChange={e=>setGuestTravelReason(e.target.value)}>
                    <option value="Turismo">Turismo / Ocio</option>
                    <option value="Negocios">Negocios / Trabajo</option>
                    <option value="Salud">Salud</option>
                    <option value="Eventos">Eventos / Congresos</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              {/* WHATSAPP DEL HUÉSPED */}
              <div className="flex gap-2 mb-2">
                <div className="form-group" style={{flex: 1}}>
                  <label>Cód. País</label>
                  <input 
                    type="text" 
                    list="countryCodes" 
                    className="admin-input" 
                    value={guestPhoneCode} 
                    onChange={e=>setGuestPhoneCode(e.target.value)} 
                    placeholder="+57"
                    required 
                  />
                  <datalist id="countryCodes">
                    <option value="+57">Colombia (+57)</option>
                    <option value="+1">EE.UU / Canadá (+1)</option>
                    <option value="+58">Venezuela (+58)</option>
                    <option value="+52">México (+52)</option>
                    <option value="+34">España (+34)</option>
                    <option value="+51">Perú (+51)</option>
                    <option value="+56">Chile (+56)</option>
                    <option value="+54">Argentina (+54)</option>
                    <option value="+593">Ecuador (+593)</option>
                  </datalist>
                </div>
                <div className="form-group" style={{flex: 2}}>
                  <label>Número de WhatsApp</label>
                  <input type="text" className="admin-input" required placeholder="Ej. 3001234567" value={guestPhone} onChange={e=>setGuestPhone(e.target.value)} />
                </div>
              </div>

              {/* SECCIÓN ACOMPAÑANTES */}
              <div style={{marginTop: '15px', borderTop: '1px solid #dcdde1', paddingTop: '10px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                  <label style={{fontWeight: 'bold', fontSize: '0.85rem'}}>Acompañantes</label>
                  <button 
                    type="button" 
                    className="admin-btn" 
                    style={{padding: '5px 10px', fontSize: '0.8rem', display: 'flex', gap: '5px', alignItems: 'center'}}
                    onClick={() => setCompanions([...companions, {name: '', idType: 'CC', idNumber: ''}])}
                  >
                    <Plus size={14}/> Añadir Acompañante
                  </button>
                </div>
                
                {companions.map((comp, index) => (
                  <div key={index} className="flex gap-2 mb-2 items-center" style={{backgroundColor: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #e1e1e1'}}>
                    <div className="form-group" style={{flex: 2, marginBottom: 0}}>
                      <input type="text" className="admin-input" placeholder="Nombres" value={comp.name} required
                        onChange={e => {
                          const newComps = [...companions];
                          newComps[index].name = e.target.value;
                          setCompanions(newComps);
                        }} 
                      />
                    </div>
                    <div className="form-group" style={{flex: 1, marginBottom: 0}}>
                      <select className="admin-select" value={comp.idType}
                        onChange={e => {
                          const newComps = [...companions];
                          newComps[index].idType = e.target.value;
                          setCompanions(newComps);
                        }}>
                        <option value="CC">CC</option>
                        <option value="CE">CE</option>
                        <option value="PA">PA</option>
                        <option value="TI">TI</option>
                      </select>
                    </div>
                    <div className="form-group" style={{flex: 1.5, marginBottom: 0}}>
                      <input type="text" className="admin-input" placeholder="Documento" value={comp.idNumber} required
                        onChange={e => {
                          const newComps = [...companions];
                          newComps[index].idNumber = e.target.value;
                          setCompanions(newComps);
                        }} 
                      />
                    </div>
                    <button type="button" style={{color: '#c23616', background: 'none', border: 'none', cursor: 'pointer', padding: '5px'}}
                      onClick={() => setCompanions(companions.filter((_, i) => i !== index))}>
                      ✖
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECCIÓN INVENTARIO */}
            <div className="bg-gray-100 p-3 rounded mt-3 mb-3 border border-gray-200" style={{backgroundColor: '#f8f9fa'}}>
              <h4 className="text-sm mb-2" style={{color: '#7f8fa6'}}>Inventario Entregado</h4>
              <div className="flex items-center gap-4 text-sm flex-wrap">
                <label className="flex items-center gap-1"><input type="checkbox" checked={invTV} onChange={e=>setInvTV(e.target.checked)}/> Control TV</label>
                <label className="flex items-center gap-1"><input type="checkbox" checked={invAC} onChange={e=>setInvAC(e.target.checked)}/> Control Aire</label>
                <label className="flex items-center gap-1">Llaves: <input type="number" min="0" max="5" value={invKeys} onChange={e=>setInvKeys(e.target.value)} style={{width:'40px'}}/></label>
              </div>
              <div className="mt-2 text-sm">
                <label>Otros:</label>
                <input type="text" className="admin-input p-1" style={{height:'30px', fontSize:'0.8rem'}} placeholder="Ej. Secador..." value={invOther} onChange={e=>setInvOther(e.target.value)} />
              </div>
            </div>

            <hr className="my-4 border-t border-gray-200" style={{ margin: '20px 0', borderColor: '#f1f2f6'}} />

            {/* COBRO HOSPEDAJE */}
            <div className="form-group">
              <label>Monto del Hospedaje</label>
              <input 
                type="text" 
                className="admin-input" 
                placeholder="$0 COP" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Método de Pago</label>
              <select 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="admin-select"
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Nequi">Nequi</option>
                <option value="Daviplata">Daviplata</option>
                <option value="Bancolombia">Transferencia Bancolombia</option>
                <option value="PSE">PSE</option>
                <option value="Tarjeta">Tarjeta de Crédito / Débito</option>
              </select>
            </div>

            {paymentMethod !== 'Efectivo' && (
              <div className="form-group">
                <label>Código de Aprobación o Referencia</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  placeholder="Ej. 12345678" 
                  value={transactionCode}
                  onChange={(e) => setTransactionCode(e.target.value)}
                />
              </div>
            )}

            <button type="submit" className="admin-btn admin-btn-primary" style={{marginTop: '15px'}}>Registrar Ingreso (Check-In)</button>
          </form>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2>Salidas Pendientes (Check-Out)</h2>
          </div>
          <div className="checkout-list">
            {occupiedRooms.length === 0 ? (
              <p className="text-muted">No hay habitaciones ocupadas en este momento.</p>
            ) : (
              occupiedRooms.map(room => (
                <div key={room.id} className="checkout-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div className="checkout-info" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <div>
                      <h4>Hab. {room.id} - {room.guest}</h4>
                      <p>Salida: {room.checkout}</p>
                      <p style={{fontSize: '0.8rem', color: '#166534', marginTop: '5px'}}>PIN WiFi: {room.wifiPin}</p>
                      {room.extras && room.extras.length > 0 && (
                        <p style={{fontSize: '0.8rem', color: '#c23616', fontWeight: 'bold'}}>{room.extras.filter(e => !e.isPaid).length} Consumos Pendientes</p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 'bold' }}>Hospedaje: {room.amountPaid}</p>
                      <p style={{ fontSize: '0.8rem' }}>{room.paymentMethod}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '5px', width: '100%', flexWrap: 'wrap' }}>
                    <button 
                      className="admin-btn"
                      style={{ flex: '1 1 45%', backgroundColor: '#f1f2f6', color: '#2f3640', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontSize: '0.75rem', padding: '6px' }}
                      onClick={() => printVoucher(room)}
                    >
                      <Printer size={14} /> Imprimir
                    </button>
                    <button 
                      className="admin-btn"
                      style={{ flex: '1 1 45%', backgroundColor: '#25D366', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontSize: '0.75rem', padding: '6px' }}
                      onClick={() => sendWhatsAppVoucher(room)}
                    >
                      <Smartphone size={14} /> WhatsApp
                    </button>
                    <button 
                      className="admin-btn"
                      style={{ flex: '1 1 45%', backgroundColor: '#fff9e6', color: '#e1b12c', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontSize: '0.75rem', padding: '6px', border: '1px solid #e1b12c' }}
                      onClick={() => setExtraRoomId(room.id)}
                    >
                      <Plus size={14} /> Consumo
                    </button>
                    <button 
                      className="admin-btn admin-btn-danger"
                      style={{ flex: '1 1 45%', fontSize: '0.75rem', padding: '6px' }}
                      onClick={() => setCheckoutRoom(room)}
                    >
                      Check-Out
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
