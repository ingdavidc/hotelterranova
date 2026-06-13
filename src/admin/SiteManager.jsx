import React, { useState } from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import { Plus, Trash2, Save, Type, BedDouble, Star } from 'lucide-react';

export default function SiteManager() {
  const { 
    heroContent, setHeroContent,
    aboutContent, setAboutContent,
    publicRooms, addPublicRoom, updatePublicRoom, deletePublicRoom,
    services, addService, updateService, deleteService
  } = useSiteContent();

  const [activeTab, setActiveTab] = useState('general');

  const handleHeroChange = (e) => {
    setHeroContent({ ...heroContent, [e.target.name]: e.target.value });
  };

  const handleAboutChange = (e) => {
    setAboutContent({ ...aboutContent, [e.target.name]: e.target.value });
  };

  const handleParagraphChange = (index, value) => {
    const newParagraphs = [...aboutContent.paragraphs];
    newParagraphs[index] = value;
    setAboutContent({ ...aboutContent, paragraphs: newParagraphs });
  };

  return (
    <div className="admin-sitemanager">
      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}><Type size={18} style={{marginRight: '8px', verticalAlign: 'text-bottom'}}/> Textos Generales</button>
        <button className={`admin-tab ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => setActiveTab('rooms')}><BedDouble size={18} style={{marginRight: '8px', verticalAlign: 'text-bottom'}}/> Habitaciones Públicas</button>
        <button className={`admin-tab ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}><Star size={18} style={{marginRight: '8px', verticalAlign: 'text-bottom'}}/> Servicios</button>
      </div>

      <div className="admin-panel mt-4">
        {activeTab === 'general' && (
          <div>
            <h3>Sección Principal (Hero)</h3>
            <div className="form-group">
              <label>Título Principal</label>
              <textarea name="title" className="admin-input" rows="2" value={heroContent.title} onChange={handleHeroChange}></textarea>
            </div>
            <div className="form-group">
              <label>Subtítulo</label>
              <textarea name="subtitle" className="admin-input" rows="2" value={heroContent.subtitle} onChange={handleHeroChange}></textarea>
            </div>
            <div className="form-group">
              <label>Imagen de Fondo (Ruta)</label>
              <input type="text" name="backgroundImage" className="admin-input" value={heroContent.backgroundImage} onChange={handleHeroChange} />
            </div>

            <hr className="my-4"/>

            <h3>Sección "Sobre Nosotros"</h3>
            <div className="form-group">
              <label>Subtítulo Pequeño</label>
              <input type="text" name="subtitle" className="admin-input" value={aboutContent.subtitle} onChange={handleAboutChange} />
            </div>
            <div className="form-group">
              <label>Título</label>
              <input type="text" name="title" className="admin-input" value={aboutContent.title} onChange={handleAboutChange} />
            </div>
            <div className="form-group">
              <label>Párrafo 1</label>
              <textarea className="admin-input" rows="3" value={aboutContent.paragraphs[0]} onChange={(e) => handleParagraphChange(0, e.target.value)}></textarea>
            </div>
            <div className="form-group">
              <label>Párrafo 2</label>
              <textarea className="admin-input" rows="3" value={aboutContent.paragraphs[1]} onChange={(e) => handleParagraphChange(1, e.target.value)}></textarea>
            </div>
            
            <button className="admin-btn admin-btn-primary mt-2"><Save size={16} className="inline mr-2"/> Cambios Guardados Automáticamente</button>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div>
            <div className="flex-between mb-4">
              <h3>Habitaciones Mostradas en la Web</h3>
              <button className="admin-btn admin-btn-primary" onClick={() => addPublicRoom({title: 'Nueva Habitación', price: '$0', description: '', images: ['', '', ''], isPopular: false})}><Plus size={16}/> Añadir Habitación</button>
            </div>
            
            <div className="list-group">
              {publicRooms.map(room => (
                <div key={room.id} className="list-item-card">
                  <div className="grid-2-cols mb-2">
                    <div className="form-group">
                      <label>Nombre de la Habitación</label>
                      <input type="text" className="admin-input" value={room.title} onChange={(e) => updatePublicRoom(room.id, {title: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Precio Desde</label>
                      <input type="text" className="admin-input" value={room.price} onChange={(e) => updatePublicRoom(room.id, {price: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea className="admin-input" rows="2" value={room.description} onChange={(e) => updatePublicRoom(room.id, {description: e.target.value})}></textarea>
                  </div>
                  <div className="form-group mb-2" style={{border: '1px solid #dcdde1', padding: '10px', borderRadius: '4px'}}>
                    <div className="flex-between mb-2">
                      <label style={{margin: 0}}>Galería de Imágenes (Mínimo 3)</label>
                      <button className="admin-btn text-sm" style={{padding: '2px 8px'}} onClick={() => {
                        const newImages = [...(room.images || [])];
                        newImages.push('');
                        updatePublicRoom(room.id, {images: newImages});
                      }}><Plus size={12} className="inline"/> Añadir otra foto</button>
                    </div>
                    {room.images && room.images.map((img, idx) => (
                      <div key={idx} className="flex gap-2 mb-2 items-center">
                        <input 
                          type="text" 
                          className="admin-input" 
                          placeholder="Ruta de la imagen (Ej. /gallery-1.jpeg)" 
                          value={img} 
                          onChange={(e) => {
                            const newImages = [...room.images];
                            newImages[idx] = e.target.value;
                            updatePublicRoom(room.id, {images: newImages});
                          }} 
                        />
                        {room.images.length > 3 && (
                          <button className="admin-btn admin-btn-danger" style={{padding: '5px 8px'}} onClick={() => {
                            const newImages = room.images.filter((_, i) => i !== idx);
                            updatePublicRoom(room.id, {images: newImages});
                          }}><Trash2 size={12}/></button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="form-group switch-group border-0 pt-0">
                     <label>Destacar (Más Popular)</label>
                     <label className="switch">
                       <input type="checkbox" checked={room.isPopular} onChange={(e) => updatePublicRoom(room.id, {isPopular: e.target.checked})} />
                       <span className="slider round"></span>
                     </label>
                  </div>
                  <div className="text-right">
                    <button className="admin-btn admin-btn-danger text-sm" onClick={() => deletePublicRoom(room.id)}><Trash2 size={14}/> Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <div className="flex-between mb-4">
              <h3>Servicios y Comodidades</h3>
              <button className="admin-btn admin-btn-primary" onClick={() => addService({title: 'Nuevo Servicio', description: '', icon: 'Star'})}><Plus size={16}/> Añadir Servicio</button>
            </div>
            
            <div className="list-group">
              {services.map(service => (
                <div key={service.id} className="list-item-card">
                  <div className="grid-2-cols mb-2">
                    <div className="form-group">
                      <label>Título del Servicio</label>
                      <input type="text" className="admin-input" value={service.title} onChange={(e) => updateService(service.id, {title: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Nombre del Icono (Lucide)</label>
                      <input type="text" className="admin-input" value={service.icon} onChange={(e) => updateService(service.id, {icon: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group mb-2">
                    <label>Descripción</label>
                    <input type="text" className="admin-input" value={service.description} onChange={(e) => updateService(service.id, {description: e.target.value})} />
                  </div>
                  <div className="text-right">
                    <button className="admin-btn admin-btn-danger text-sm" onClick={() => deleteService(service.id)}><Trash2 size={14}/> Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
