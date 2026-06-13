import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, ChevronRight, Menu, X, Star, Wind, Wifi, Coffee, Car, ChevronLeft, MessageCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useSiteContent } from './context/SiteContentContext';

// Helper component para renderizar iconos dinámicamente desde un string
const DynamicIcon = ({ name, size, className }) => {
  const IconComponent = LucideIcons[name];
  if (!IconComponent) return <Star size={size} className={className} />;
  return <IconComponent size={size} className={className} />;
};

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedGalleryRoom, setSelectedGalleryRoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Consumimos los datos del CMS
  const { heroContent, aboutContent, publicRooms, services } = useSiteContent();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openGallery = (room) => {
    setSelectedGalleryRoom(room);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedGalleryRoom && selectedGalleryRoom.images) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedGalleryRoom.images.length);
    }
  };

  const prevImage = () => {
    if (selectedGalleryRoom && selectedGalleryRoom.images) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedGalleryRoom.images.length) % selectedGalleryRoom.images.length);
    }
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
        <div className="header__content">
          <div className="header__logo">
            <img src="/logo.png" alt="Hotel Terranova Logo" className="logo-img" />
          </div>
          <nav className="header__nav">
            <a href="#el-hotel" className="nav-link">El Hotel</a>
            <a href="#habitaciones" className="nav-link">Habitaciones</a>
            <a href="#servicios" className="nav-link">Servicios</a>
            <a href="#contacto" className="nav-link">Contacto</a>
            <button className="btn btn--primary header__btn">Reservar</button>
          </nav>
          <button className="header__menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="header__mobile-nav">
            <a href="#el-hotel" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>El Hotel</a>
            <a href="#habitaciones" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Habitaciones</a>
            <a href="#servicios" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Servicios</a>
            <button className="btn btn--primary btn--mobile">Reservar Ahora</button>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero__background" style={{ backgroundImage: `url("${heroContent.backgroundImage}")` }}>
          <div className="hero__overlay"></div>
        </div>
        <div className="hero__content">
          <div className="hero__stars">
            <Star size={20} className="star-icon" fill="currentColor" />
            <Star size={20} className="star-icon" fill="currentColor" />
            <Star size={20} className="star-icon" fill="currentColor" />
            <Star size={20} className="star-icon" fill="currentColor" />
          </div>
          <h1 className="hero__title" style={{ whiteSpace: 'pre-line' }}>{heroContent.title}</h1>
          <p className="hero__subtitle">
            {heroContent.subtitle}
          </p>
        </div>

        {/* BOOKING BAR */}
        <div className="booking-bar-wrapper">
          <div className="booking-bar">
            <div className="booking-field">
              <label>Llegada</label>
              <div className="input-wrapper">
                <Calendar className="input-icon" size={20} />
                <input type="date" className="booking-input" />
              </div>
            </div>
            <div className="booking-field">
              <label>Salida</label>
              <div className="input-wrapper">
                <Calendar className="input-icon" size={20} />
                <input type="date" className="booking-input" />
              </div>
            </div>
            <div className="booking-field">
              <label>Huéspedes</label>
              <div className="input-wrapper">
                <Users className="input-icon" size={20} />
                <select className="booking-input booking-select">
                  <option>1 Adulto</option>
                  <option>2 Adultos</option>
                  <option>2 Adultos, 1 Niño</option>
                  <option>2 Adultos, 2 Niños</option>
                </select>
              </div>
            </div>
            <div className="booking-action">
              <button className="btn btn--dark btn--full">Ver Disponibilidad</button>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="el-hotel" className="section about">
        <div className="about__container">
          <div className="about__text">
            <span className="section-subtitle">{aboutContent.subtitle}</span>
            <h2 className="section-title">{aboutContent.title}</h2>
            {aboutContent.paragraphs.map((p, index) => (
              <p key={index} className="section-desc">{p}</p>
            ))}
            <button className="btn-text">
              {aboutContent.buttonText || 'Conoce nuestra historia'} <ChevronRight size={18} />
            </button>
          </div>
          <div className="about__image-wrapper">
            <div className="about__image-accent"></div>
            <img src="https://images.unsplash.com/photo-1566073171526-87f91766cc19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Recepción Hotel Terranova" className="about__image" />
          </div>
        </div>
      </section>

      {/* ROOMS SECTION */}
      <section id="habitaciones" className="section rooms bg-light">
        <div className="rooms__container">
          <div className="section-header text-center">
            <span className="section-subtitle">Nuestros Espacios</span>
            <h2 className="section-title">Habitaciones & Suites</h2>
          </div>
          <div className="rooms__grid">
            {publicRooms.map(room => (
              <div key={room.id} className={`room-card ${room.isPopular ? 'room-card--featured' : ''}`}>
                {room.isPopular && <div className="room-card__badge">Más Popular</div>}
                <div className="room-card__image-wrapper" onClick={() => openGallery(room)} style={{cursor: 'pointer'}}>
                  <img src={room.images && room.images.length > 0 ? room.images[0] : ''} alt={room.title} className="room-card__image" />
                  <div className="room-card__price">{room.price}</div>
                  <div style={{position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px'}}>
                    <span>{room.images ? room.images.length : 0} fotos</span>
                  </div>
                </div>
                <div className="room-card__content">
                  <h3 className="room-card__title">{room.title}</h3>
                  <p className="room-card__desc">{room.description}</p>
                  <div className="room-card__amenities">
                    <Wind size={18} /> <Wifi size={18} /> <Coffee size={18} />
                  </div>
                  <button className="btn btn--outline btn--full" onClick={() => openGallery(room)}>Ver Galería Completa</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="servicios" className="section services bg-dark text-light">
        <div className="services__container">
          <div className="services__header">
            <div>
              <span className="section-subtitle color-primary">Comodidades</span>
              <h2 className="section-title">Pensado para tu confort</h2>
            </div>
            <p className="services__header-desc">
              En Saravena el clima exige los mejores estándares. Por eso nuestras instalaciones están dotadas para que no te falte nada.
            </p>
          </div>
          <div className="services__grid">
            {services.map(service => (
              <div key={service.id} className="service-card">
                <DynamicIcon name={service.icon} size={40} className="service-card__icon" />
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__desc">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contacto" className="footer">
        <div className="footer__container">
          <div className="footer__brand">
            <div className="footer__logo-text">
              <span className="footer__logo-title">Terranova</span>
              <span className="footer__logo-subtitle">HOTEL</span>
            </div>
            <p className="footer__desc">
              El refugio perfecto en Saravena, Arauca. Donde la elegancia moderna se encuentra con la belleza del piedemonte llanero.
            </p>
          </div>
          <div className="footer__contact">
            <h4 className="footer__title">Contacto</h4>
            <ul className="footer__list">
              <li>
                <MapPin className="footer__icon" size={18} />
                <span>Calle Principal #12-34<br/>Barrio Centro, Saravena<br/>Arauca, Colombia</span>
              </li>
              <li>
                <a href="tel:+573000000000">+57 300 000 0000</a>
              </li>
              <li>
                <a href="mailto:reservas@hotelterranova.com">reservas@hotelterranova.com</a>
              </li>
            </ul>
          </div>
          <div className="footer__links">
            <h4 className="footer__title">Enlaces Rápidos</h4>
            <ul className="footer__list">
              <li><a href="#el-hotel">Sobre Nosotros</a></li>
              <li><a href="#habitaciones">Habitaciones</a></li>
              <li><a href="#servicios">Servicios</a></li>
              <li><a href="#">Políticas de Cancelación</a></li>
            </ul>
          </div>
          <div className="footer__newsletter">
            <h4 className="footer__title">Boletín</h4>
            <p>Suscríbete para recibir ofertas exclusivas.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Tu correo electrónico" />
              <button><ChevronRight size={20} /></button>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} Hotel Terranova Saravena. Todos los derechos reservados.</p>
          <div className="footer__socials" style={{ alignItems: 'center' }}>
            <a href="/admin" style={{ color: 'var(--color-primary)', marginRight: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LucideIcons.Lock size={16} /> Panel Admin
            </a>
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </footer>

      {/* MODAL DE GALERÍA DE HABITACIONES */}
      {selectedGalleryRoom && selectedGalleryRoom.images && (
        <div className="gallery-modal">
          <button className="gallery-modal-close" onClick={() => setSelectedGalleryRoom(null)}>
            <X size={32} />
          </button>
          
          <div className="gallery-modal-content">
            <button className="gallery-nav-btn prev-btn" onClick={prevImage}><ChevronLeft size={36} /></button>
            <div className="gallery-image-container">
              <img src={selectedGalleryRoom.images[currentImageIndex]} alt={`Foto ${currentImageIndex + 1} de ${selectedGalleryRoom.title}`} />
              <div className="gallery-counter">{currentImageIndex + 1} / {selectedGalleryRoom.images.length}</div>
              <h3 className="gallery-title">{selectedGalleryRoom.title}</h3>
            </div>
            <button className="gallery-nav-btn next-btn" onClick={nextImage}><ChevronRight size={36} /></button>
          </div>
        </div>
      )}
      {/* FLOATING SOCIAL BAR */}
      <div className="floating-social-bar">
        <a href="https://wa.me/573126909661" target="_blank" rel="noreferrer" className="social-btn whatsapp-btn" title="WhatsApp">
          <MessageCircle size={24} />
        </a>
        <a href="#" target="_blank" rel="noreferrer" className="social-btn facebook-btn" title="Facebook">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
        </a>
        <a href="#" target="_blank" rel="noreferrer" className="social-btn instagram-btn" title="Instagram">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </a>
        <a href="https://www.google.com/maps/search/?api=1&query=Calle+19+No.+10+-+06+Saravena" target="_blank" rel="noreferrer" className="social-btn location-btn" title="Ubicación">
          <MapPin size={24} />
        </a>
      </div>
    </div>
  );
}
