'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Configuration de l'icône personnalisée (icône Leaflet par défaut buguée avec Webpack/Next)
const createCustomIcon = (isSelected, isRecycling) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${isSelected ? '#FCE500' : '#27509B'};
        color: ${isSelected ? '#00205B' : '#ffffff'};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 6px rgba(0,0,0,0.4);
        transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
        transition: transform 0.2s;
        font-size: 16px;
      ">
        ${isRecycling ? '♻️' : '🚲'}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  })
}

// Composant utilitaire pour recentrer la carte quand les magasins changent
function ChangeView({ center, zoom, bounds }) {
  const map = useMap()
  
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      const latLngBounds = L.latLngBounds(bounds.map(b => [b.lat, b.lng]))
      map.fitBounds(latLngBounds, { padding: [50, 50], maxZoom: 14 })
    } else if (center) {
      map.setView(center, zoom || 13)
    }
  }, [center, zoom, bounds, map])
  
  return null
}

export default function ResellersMap({ stores, selectedStoreId, onSelectStore }) {
  // Calcul du centre initial (moyenne des points ou Paris par défaut)
  const defaultCenter = [46.603354, 1.888334] // Centre de la France
  
  const center = stores.length > 0 
    ? [stores[0].lat, stores[0].lng] 
    : defaultCenter

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', background: '#f8f9fa' }}
        zoomControl={false}
        attributionControl={false}
      >
        {/* Tuiles OpenStreetMap classique */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <ChangeView center={center} bounds={stores} />

        {stores.map((store) => {
          const isSelected = store.id === selectedStoreId
          return (
            <Marker 
              key={store.id} 
              position={[store.lat, store.lng]}
              icon={createCustomIcon(isSelected, store.recycling)}
              eventHandlers={{
                click: () => onSelectStore(store.id),
              }}
            >
              <Popup className="custom-popup">
                <div style={{ padding: '4px', textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold', color: '#00205B' }}>
                    {store.name}
                  </h4>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
                    {store.address}
                  </p>
                  {store.recycling && (
                    <span style={{ fontSize: '12px', color: '#84bd00', fontWeight: 'bold' }}>
                      ♻️ Accepte le recyclage
                    </span>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
      
      {/* CSS global pour ajuster les popups de Leaflet dans notre thème */}
      <style>{`
        .leaflet-container {
          font-family: inherit;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        .custom-popup .leaflet-popup-tip {
          box-shadow: none;
        }
        .leaflet-control-attribution {
          background: rgba(0,0,0,0.5) !important;
          color: rgba(255,255,255,0.5) !important;
        }
        .leaflet-control-attribution a {
          color: rgba(255,255,255,0.7) !important;
        }
      `}</style>
    </div>
  )
}
