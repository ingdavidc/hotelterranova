import React, { createContext, useState, useContext } from 'react';

const SiteContentContext = createContext();

export const useSiteContent = () => useContext(SiteContentContext);

export const SiteContentProvider = ({ children }) => {
  const [heroContent, setHeroContent] = useState({
    title: 'Descubre el Corazón\nde Saravena',
    subtitle: 'Confort, elegancia y la mejor atención en la puerta de entrada al piedemonte llanero de Arauca.',
    backgroundImage: '/hotel.png'
  });

  const [aboutContent, setAboutContent] = useState({
    subtitle: 'Bienvenidos a Terranova',
    title: 'Un oasis de tranquilidad en el departamento de Arauca',
    paragraphs: [
      'Diseñado pensando en la comodidad del viajero moderno y de negocios. El Hotel Terranova se erige como la opción más prestigiosa en Saravena, combinando una arquitectura moderna con el cálido servicio que caracteriza a nuestra región.',
      'Ya sea que nos visite por negocios o para explorar la riqueza natural del piedemonte llanero, nuestras instalaciones están preparadas para hacer de su estancia una experiencia inolvidable.'
    ],
    buttonText: 'Conoce nuestra historia'
  });

  const [publicRooms, setPublicRooms] = useState([
    {
      id: 'room-1',
      title: 'Habitación Estándar',
      price: 'Desde $120.000 COP',
      description: 'Perfecta para el viajero de negocios. Equipada con cama doble, escritorio de trabajo y aire acondicionado silencioso.',
      images: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
        'https://images.unsplash.com/photo-1582719478250-c89d145108c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      isPopular: false
    },
    {
      id: 'room-2',
      title: 'Doble Superior',
      price: 'Desde $180.000 COP',
      description: 'Amplitud y confort para parejas o compañeros. Dos camas semi-dobles, zona de estar y vistas a la ciudad.',
      images: [
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
        'https://images.unsplash.com/photo-1598928506311-c55dd1b62600?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      isPopular: true
    },
    {
      id: 'room-3',
      title: 'Suite Terranova',
      price: 'Desde $280.000 COP',
      description: 'La experiencia definitiva. Cama King size, sala de estar independiente, minibar premium y balcón privado.',
      images: [
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
        'https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      isPopular: false
    }
  ]);

  const [services, setServices] = useState([
    { id: 'srv-1', title: 'Aire Acondicionado', description: 'Climatización silenciosa en todas las áreas.', icon: 'Wind' },
    { id: 'srv-2', title: 'Wi-Fi de Alta Velocidad', description: 'Conexión estable por fibra óptica gratuita.', icon: 'Wifi' },
    { id: 'srv-3', title: 'Parqueadero Privado', description: 'Vigilancia 24/7 exclusiva para nuestros huéspedes.', icon: 'Car' },
    { id: 'srv-4', title: 'Desayuno Incluido', description: 'Opciones típicas llaneras y continentales.', icon: 'Coffee' }
  ]);

  // Funciones CRUD para Habitaciones
  const addPublicRoom = (newRoom) => setPublicRooms([...publicRooms, { ...newRoom, id: Date.now().toString() }]);
  const updatePublicRoom = (id, updatedRoom) => setPublicRooms(publicRooms.map(r => r.id === id ? { ...r, ...updatedRoom } : r));
  const deletePublicRoom = (id) => setPublicRooms(publicRooms.filter(r => r.id !== id));

  // Funciones CRUD para Servicios
  const addService = (newService) => setServices([...services, { ...newService, id: Date.now().toString() }]);
  const updateService = (id, updatedService) => setServices(services.map(s => s.id === id ? { ...s, ...updatedService } : s));
  const deleteService = (id) => setServices(services.filter(s => s.id !== id));

  return (
    <SiteContentContext.Provider value={{
      heroContent, setHeroContent,
      aboutContent, setAboutContent,
      publicRooms, addPublicRoom, updatePublicRoom, deletePublicRoom,
      services, addService, updateService, deleteService
    }}>
      {children}
    </SiteContentContext.Provider>
  );
};
