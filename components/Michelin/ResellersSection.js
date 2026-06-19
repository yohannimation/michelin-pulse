'use client'

import { useState, useMemo } from 'react'
import { useStore } from '../../store/useStore'
import { TIRE_MODELS } from '../../experience/World/TireCatalog'

// Liste de villes par défaut ou entrées pour générer des coordonnées cohérentes
const DEFAULT_STORES = [
  {
    id: 1,
    name: 'Cycles Laurent',
    street: '9 Boulevard Voltaire',
    phone: '01 47 00 23 45',
    hours: 'Lun–Sam · 9h–19h',
    dx: 35,
    dy: 45,
    stock: 'En stock',
    priceOffset: 0,
  },
  {
    id: 2,
    name: 'Culture Vélo Partner',
    street: '148 Avenue Daumesnil',
    phone: '01 44 75 32 10',
    hours: 'Mar–Sam · 10h–19h',
    dx: 65,
    dy: 30,
    stock: 'En stock',
    priceOffset: 2.9,
  },
  {
    id: 3,
    name: 'Cyclable Pro',
    street: '24 Rue de la Roquette',
    phone: '01 43 55 12 12',
    hours: 'Lun–Sam · 8h30–19h',
    dx: 50,
    dy: 70,
    stock: 'Disponible sous 24h',
    priceOffset: -1.5,
  }
]

export default function ResellersSection() {
  const activeTireModel = useStore((s) => s.activeTireModel)
  const [searchQuery, setSearchQuery] = useState('Clermont-Ferrand')
  const [currentCity, setCurrentCity] = useState('Clermont-Ferrand')
  const [selectedStoreId, setSelectedStoreId] = useState(1)
  const [reservationModalOpen, setReservationModalOpen] = useState(false)
  const [reservedStore, setReservedStore] = useState(null)
  const [reservationCode, setReservationCode] = useState('')

  // Retrouve le modèle de pneu actif pour afficher le bon prix et nom
  const tyre = useMemo(() => {
    return TIRE_MODELS.find((m) => m.id === activeTireModel) || TIRE_MODELS[0]
  }, [activeTireModel])

  // Prix simulé : gamme Racing = 59.9€, Competition = 49.9€, Performance = 39.9€, Access = 24.9€
  const basePrice = useMemo(() => {
    switch (tyre.category) {
      case 'Course':
        return 59.99
      case 'Route':
        return 49.99
      case 'Collection':
        return 39.99
      default:
        return 29.99
    }
  }, [tyre])

  // Génère les boutiques à proximité selon la recherche
  const stores = useMemo(() => {
    const city = currentCity.trim() || 'Clermont-Ferrand'
    return DEFAULT_STORES.map((s) => {
      const price = basePrice + s.priceOffset
      const distance = ((s.id * 1.3) + (city.length % 3) * 0.7).toFixed(1)
      return {
        ...s,
        address: `${s.street}, ${city}`,
        distance: `${distance} km`,
        price: `${price.toFixed(2)} €`,
      }
    })
  }, [currentCity, basePrice])

  const selectedStore = useMemo(() => {
    return stores.find((s) => s.id === selectedStoreId) || stores[0]
  }, [stores, selectedStoreId])

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      setCurrentCity(searchQuery.trim())
    }
  }

  function handleReserve(store) {
    const code = 'MP-' + Math.floor(10000 + Math.random() * 90000)
    setReservedStore(store)
    setReservationCode(code)
    setReservationModalOpen(true)
  }

  return (
    <div className="tire-card-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '24px' }}>
      <div className="tire-card-section-header">
        <h5 className="tire-section-title">Boutiques &amp; Revendeurs Agréés</h5>
        <div className="tire-section-badge">Physique · Stock Temps Réel</div>
      </div>

      <p className="tire-section-description" style={{ fontSize: '13px', opacity: 0.8, marginBottom: '16px', lineHeight: '1.4' }}>
        Recherchez un magasin MICHELIN de confiance à proximité de chez vous pour acheter ou faire monter votre pneu <strong>MICHELIN {tyre.name}</strong>.
      </p>

      {/* Barre de recherche */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Saisissez une adresse, ville ou code postal..."
            style={{
              width: '100%',
              height: '44px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.2)',
              backgroundColor: 'rgba(255,255,255,0.05)',
              color: '#ffffff',
              paddingLeft: '16px',
              paddingRight: '16px',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            height: '44px',
            paddingLeft: '20px',
            paddingRight: '20px',
            backgroundColor: '#FCE500',
            color: '#00205B',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Rechercher
        </button>
      </form>

      {/* Grid Carte + Liste */}
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-5">
        
        {/* Liste des boutiques */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {stores.map((store) => {
            const isSelected = store.id === selectedStoreId
            return (
              <div
                key={store.id}
                onClick={() => setSelectedStoreId(store.id)}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  border: isSelected ? '2px solid #FCE500' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: isSelected ? 'rgba(252,229,0,0.05)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#ffffff' }}>{store.name}</span>
                  <span style={{ fontSize: '12px', color: '#FCE500', fontWeight: 'semibold' }}>{store.distance}</span>
                </div>
                <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '10px', color: '#ffffff' }}>{store.address}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', marginBottom: '12px' }}>
                  <span style={{ color: store.stock.includes('En stock') ? '#84bd00' : '#f9a825', fontWeight: 'bold' }}>
                    ✓ {store.stock}
                  </span>
                  <span style={{ opacity: 0.6 }}>Tél : {store.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#FCE500' }}>{store.price}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReserve(store)
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#27509B',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    Réserver
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Carte SVG interactive */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '16/11',
            backgroundColor: '#00133a',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {/* Fond de plan stylisé */}
          <svg viewBox="0 0 400 275" style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
            {/* Rivières ou éléments géographiques */}
            <path d="M-10,130 C120,120 280,180 410,170" fill="none" stroke="rgba(39,80,155,0.3)" strokeWidth="18" />
            <path d="M-10,130 C120,120 280,180 410,170" fill="none" stroke="rgba(39,80,155,0.5)" strokeWidth="6" />
            {/* Rues principales */}
            <line x1="50" y1="-10" x2="350" y2="285" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
            <line x1="-10" y1="90" x2="410" y2="90" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
            <line x1="200" y1="-10" x2="200" y2="285" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <line x1="-10" y1="210" x2="410" y2="180" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
            {/* Parcs */}
            <rect x="230" y="40" width="80" height="60" rx="8" fill="rgba(46,125,50,0.1)" />
            <circle cx="80" cy="220" r="30" fill="rgba(46,125,50,0.08)" />
            {/* Textes de la carte */}
            <text x="270" y="75" fill="rgba(255,255,255,0.2)" fontSize="10" fontWeight="bold">PARC CENTRAL</text>
            <text x="210" y="240" fill="rgba(255,255,255,0.15)" fontSize="9" transform="rotate(-5,210,240)">BD DE L&apos;EUROPE</text>
          </svg>

          {/* Marqueurs de boutiques */}
          {stores.map((store) => {
            const isSelected = store.id === selectedStoreId
            const left = `${store.dx}%`
            const top = `${store.dy}%`

            return (
              <button
                key={store.id}
                onClick={() => setSelectedStoreId(store.id)}
                style={{
                  position: 'absolute',
                  left,
                  top,
                  transform: 'translate(-50%, -100%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: isSelected ? 10 : 2,
                  transition: 'all 0.2s',
                }}
              >
                {/* Bulle de nom au dessus du marqueur au survol ou sélection */}
                <div
                  style={{
                    backgroundColor: isSelected ? '#FCE500' : '#00205B',
                    color: isSelected ? '#00205B' : '#ffffff',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    marginBottom: '4px',
                    opacity: isSelected ? 1 : 0.7,
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.2s',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {store.name}
                </div>
                {/* L'icône de Pin de la carte */}
                <div style={{ position: 'relative' }}>
                  <svg
                    width="28"
                    height="32"
                    viewBox="0 0 24 24"
                    fill={isSelected ? '#FCE500' : '#27509B'}
                    style={{
                      filter: 'drop-shadow(0px 3px 3px rgba(0,0,0,0.5))',
                      transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  {/* Petit cercle blanc au milieu du marqueur */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '25%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '6px',
                      height: '6px',
                      borderRadius: 'full',
                      backgroundColor: '#ffffff',
                    }}
                  />
                </div>
              </button>
            )
          })}
        </div>

      </div>

      {/* Modal de réservation */}
      {reservationModalOpen && reservedStore && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setReservationModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#00133a',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '24px',
              padding: '24px',
              maxWidth: '450px',
              width: '100%',
              color: '#ffffff',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(46,125,50,0.1)',
                color: '#84bd00',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '16px',
              }}
            >
              ✓
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Réservation Confirmée !</h3>
            <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '20px', lineHeight: '1.5' }}>
              Votre pneu <strong>MICHELIN {tyre.name}</strong> a été réservé avec succès chez <strong>{reservedStore.name}</strong>.
            </p>

            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px dashed rgba(255,255,255,0.2)',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              <div style={{ fontSize: '12px', opacity: 0.6, textTransform: 'uppercase', tracking: 'wide' }}>Code de retrait</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FCE500', marginTop: '4px' }}>{reservationCode}</div>
            </div>

            <div style={{ fontSize: '13px', opacity: 0.7, textAlign: 'left', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>📍 <strong>Adresse :</strong> {reservedStore.address}</div>
              <div>🕒 <strong>Horaires :</strong> {reservedStore.hours}</div>
              <div>📞 <strong>Téléphone :</strong> {reservedStore.phone}</div>
              <div>💶 <strong>Prix à régler en magasin :</strong> {reservedStore.price}</div>
            </div>

            <button
              onClick={() => setReservationModalOpen(false)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#FCE500',
                color: '#00205B',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
