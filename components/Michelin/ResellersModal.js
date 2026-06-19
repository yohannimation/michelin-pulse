'use client'

import { useState, useMemo } from 'react'
import { useStore } from '../../store/useStore'
import { TIRE_MODELS } from '../../experience/World/TireCatalog'
import dynamic from 'next/dynamic'
import ALL_STORES from '../../lib/data/resellers.json'

// Chargement dynamique de la carte pour éviter les erreurs SSR liées à l'objet window
const MapComponent = dynamic(
  () => import('./ResellersMap'),
  { ssr: false, loading: () => <div style={{display:'flex',height:'100%',alignItems:'center',justifyContent:'center',color:'#fff'}}>Chargement de la carte...</div> }
)

const CITIES = {
  'paris': { lat: 48.8566, lng: 2.3522 },
  'lyon': { lat: 45.7640, lng: 4.8357 },
  'marseille': { lat: 43.2965, lng: 5.3698 },
  'bordeaux': { lat: 44.8378, lng: -0.5792 },
  'lille': { lat: 50.6292, lng: 3.0573 },
  'clermont': { lat: 45.7772, lng: 3.0870 }
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

export default function ResellersModal({ onClose }) {
  const activeTireModel = useStore((s) => s.activeTireModel)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStoreId, setSelectedStoreId] = useState(null)
  const [reservationModalOpen, setReservationModalOpen] = useState(false)
  const [reservedStore, setReservedStore] = useState(null)
  const [reservationCode, setReservationCode] = useState('')
  const [filterRecycling, setFilterRecycling] = useState(false)

  // Retrouve le modèle de pneu actif pour afficher le bon prix et nom
  const tyre = useMemo(() => {
    return TIRE_MODELS.find((m) => m.id === activeTireModel) || TIRE_MODELS[0]
  }, [activeTireModel])

  const basePrice = useMemo(() => {
    switch (tyre.category) {
      case 'Course': return 59.99
      case 'Route': return 49.99
      case 'Collection': return 39.99
      default: return 29.99
    }
  }, [tyre])

  // Filtrage des boutiques basé sur les vraies données JSON
  const stores = useMemo(() => {
    let filtered = ALL_STORES
    
    // Filtrage par recyclage
    if (filterRecycling) {
      filtered = filtered.filter(s => s.recycling)
    }

    // Filtrage par recherche
    const q = searchQuery.trim().toLowerCase()
    
    let centerCityCoord = null;
    if (q) {
      for (const [cityName, coord] of Object.entries(CITIES)) {
        if (q === cityName || cityName.startsWith(q)) {
          centerCityCoord = coord;
          break;
        }
      }
    }

    if (centerCityCoord) {
       // On a trouvé une ville, on calcule la distance
       filtered = filtered.map(s => {
         const dist = haversineDistance(centerCityCoord.lat, centerCityCoord.lng, s.lat, s.lng);
         return { ...s, distanceVal: dist };
       });
       // On trie par distance
       filtered.sort((a, b) => a.distanceVal - b.distanceVal);
       // On garde que les 4 plus proches pour ne pas zoomer sur toute la France
       filtered = filtered.slice(0, 4);
    } else if (q) {
       // Recherche textuelle classique
       filtered = filtered.filter(s => 
        s.city.toLowerCase().includes(q) || 
        s.name.toLowerCase().includes(q) ||
        s.street.toLowerCase().includes(q)
      )
    }

    return filtered.map((s) => ({
      ...s,
      address: `${s.street}, ${s.city}`,
      distance: s.distanceVal !== undefined ? s.distanceVal.toFixed(1) + ' km' : '',
      price: `${(basePrice + s.priceOffset).toFixed(2)} €`,
    }))
  }, [searchQuery, filterRecycling, basePrice])

  // Set default selection if empty
  useMemo(() => {
    if (!selectedStoreId && stores.length > 0) {
      setSelectedStoreId(stores[0].id)
    } else if (selectedStoreId && !stores.find(s => s.id === selectedStoreId) && stores.length > 0) {
      setSelectedStoreId(stores[0].id)
    }
  }, [stores, selectedStoreId])

  const selectedStore = useMemo(() => {
    return stores.find((s) => s.id === selectedStoreId) || stores[0]
  }, [stores, selectedStoreId])

  function handleSearch(e) {
    e.preventDefault()
  }

  function handleReserve(store) {
    const code = 'MP-' + Math.floor(10000 + Math.random() * 90000)
    setReservedStore(store)
    setReservationCode(code)
    setReservationModalOpen(true)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,12,52,0.95)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Header */}
      <div className="resellers-modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', background: '#000c34', position: 'relative' }}>
        <div>
          <h2 style={{ fontFamily: 'FormulaCondensed-Regular, sans-serif', fontSize: '2rem', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', margin: 0 }}>
            Trouver un Revendeur
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Achetez ou faites monter votre pneu <strong>MICHELIN {tyre.name}</strong> dans notre réseau agréé.
          </p>
        </div>
        <button
          className="resellers-modal-close-btn"
          onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '0.75rem', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="resellers-modal-body" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Panel: List */}
        <div className="resellers-modal-list" style={{ background: 'rgba(0,12,52,0.5)', padding: '2rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexShrink: 0 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ville (ex: Paris, Lyon)..."
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: '#ffffff',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  fontSize: '15px',
                  outline: 'none',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                height: '48px',
                padding: '0 1.5rem',
                backgroundColor: '#FCE500',
                color: '#00205B',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              Filtrer
            </button>
          </form>

          {/* Filtres */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', flexShrink: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={filterRecycling}
                onChange={(e) => setFilterRecycling(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#84bd00' }}
              />
              ♻️ Revendeurs acceptant le recyclage
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
            {stores.length === 0 && (
              <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: '2rem' }}>Aucun revendeur trouvé pour cette recherche.</p>
            )}
            {stores.map((store) => {
              const isSelected = store.id === selectedStoreId
              return (
                <div
                  key={store.id}
                  onClick={() => setSelectedStoreId(store.id)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    border: isSelected ? '2px solid #FCE500' : '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: isSelected ? 'rgba(252,229,0,0.05)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#ffffff' }}>{store.name}</span>
                    <span style={{ fontSize: '0.85rem', color: '#FCE500', fontWeight: 'bold' }}>{store.distance}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.75rem', color: '#ffffff' }}>{store.address}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <span style={{ color: store.stock.includes('En stock') ? '#84bd00' : '#f9a825', fontWeight: 'bold' }}>
                      ✓ {store.stock}
                    </span>
                    <span style={{ opacity: 0.6 }}>Tél : {store.phone}</span>
                    {store.recycling && (
                      <span style={{ color: '#84bd00', fontWeight: 'bold' }}>♻️ Recyclage</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#FCE500' }}>{store.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReserve(store)
                      }}
                      style={{
                        padding: '0.6rem 1.2rem',
                        backgroundColor: '#27509B',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
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
        </div>

        {/* Right Panel: Leaflet Map */}
        <div style={{ flex: 1, position: 'relative', background: '#00133a', minHeight: '300px' }}>
          <MapComponent 
            stores={stores} 
            selectedStoreId={selectedStoreId} 
            onSelectStore={setSelectedStoreId} 
          />
        </div>
      </div>
      
      <style>{`
        .resellers-modal-body {
          flex-direction: row;
        }
        .resellers-modal-list {
          width: 450px;
          border-right: 1px solid rgba(255,255,255,0.1);
        }
        @media (max-width: 768px) {
          .resellers-modal-body {
            flex-direction: column-reverse !important;
          }
          .resellers-modal-list {
            width: 100% !important;
            height: 50% !important;
            border-right: none !important;
            border-top: 1px solid rgba(255,255,255,0.1);
            padding: 1rem !important;
          }
          .resellers-modal-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 1rem !important;
          }
          .resellers-modal-header h2 {
            font-size: 1.5rem !important;
          }
          .resellers-modal-close-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
          }
        }
      `}</style>

      {/* Modal de réservation (Nested Modal) */}
      {reservationModalOpen && reservedStore && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backdropFilter: 'blur(5px)',
          }}
          onClick={() => setReservationModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#00133a',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '24px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              color: '#ffffff',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'rgba(46,125,50,0.1)',
                color: '#84bd00',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                marginBottom: '1rem',
              }}
            >
              ✓
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Réservation Confirmée !</h3>
            <p style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Votre pneu <strong>MICHELIN {tyre.name}</strong> a été réservé avec succès chez <strong>{reservedStore.name}</strong>.
            </p>

            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px dashed rgba(255,255,255,0.2)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ fontSize: '0.85rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Code de retrait</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FCE500', marginTop: '0.5rem' }}>{reservationCode}</div>
            </div>

            <div style={{ fontSize: '0.95rem', opacity: 0.8, textAlign: 'left', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>📍 <strong>Adresse :</strong> {reservedStore.address}</div>
              <div>🕒 <strong>Horaires :</strong> {reservedStore.hours}</div>
              <div>📞 <strong>Téléphone :</strong> {reservedStore.phone}</div>
              <div>💶 <strong>Prix à régler en magasin :</strong> {reservedStore.price}</div>
              {reservedStore.recycling && (
                <div style={{ color: '#84bd00' }}>♻️ <strong>Ce magasin accepte de recycler vos anciens pneus.</strong></div>
              )}
            </div>

            <button
              onClick={() => setReservationModalOpen(false)}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: '#FCE500',
                color: '#00205B',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
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
