'use client'

import { useStore } from '../../store/useStore'

const LEVELS = [
  { id: 'competition', label: 'Compétition' },
  { id: 'entrainement', label: 'Entraînement' },
  { id: 'loisir', label: 'Loisir' },
  { id: 'debutant', label: 'Débutant' },
]

const PRATIQUES = [
  { id: 'vtt', label: 'VTT' },
  { id: 'gravel', label: 'Gravel' },
  { id: 'piste', label: 'Piste' },
  { id: 'ebike', label: 'E-Bike' },
]

const BIKE_TYPES = [
  { id: 'trail', label: 'Trail' },
  { id: 'enduro', label: 'Enduro' },
  { id: 'dh', label: 'DH' },
  { id: 'triathlon', label: 'Triathlon' },
  { id: 'course_sur_route', label: 'Course sur route' },
  { id: 'endurance_route', label: 'Endurance sur route' },
  { id: 'course_piste', label: 'Course sur piste' },
  { id: 'ville', label: 'Ville' },
  { id: 'touring', label: 'Touring' },
  { id: 'cargo', label: 'Cargo' },
  { id: 'backpacking', label: 'Backpacking' },
]

const RESSENTIS = [
  { id: 'reactif', label: 'Réactif' },
  { id: 'equilibre', label: 'Équilibré' },
  { id: 'souple', label: 'Souple' },
]

const SURFACES = [
  { id: 'asphalte_lisse', label: 'Asphalte lisse' },
  { id: 'asphalte_rugueux', label: 'Asphalte rugueux' },
  { id: 'gravel_leger', label: 'Gravel léger' },
  { id: 'paves', label: 'Pavés' },
  { id: 'compact', label: 'Compact' },
  { id: 'fin_meuble', label: 'Fin et meuble' },
  { id: 'mixte', label: 'Mixte' },
  { id: 'grossier_meuble', label: 'Grossier et meuble' },
  { id: 'boue', label: 'Boue' },
]

const CONDITIONS = [
  { id: 'sec', label: 'Sec' },
  { id: 'mixte', label: 'Mixte' },
  { id: 'humide', label: 'Humide' },
]

function ToggleGroup({ label, options, section }) {
  const rider = useStore((s) => s.rider)
  const toggleRider = useStore((s) => s.toggleRider)
  const selected = rider[section] || []

  return (
    <div className="tire-property-card">
      <div className="tire-property-header">
        <span className="tire-property-label-text">{label}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#27509B">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>
      <div className="tire-ios-toggle-group">
        {options.map((opt) => {
          const isOn = selected.includes(opt.id)
          return (
            <button
              key={opt.id}
              className={`tire-ios-toggle${isOn ? ' on' : ''}`}
              onClick={() => toggleRider(section, opt.id)}
            >
              <div className="tire-ios-track">
                <div className="tire-ios-thumb" />
              </div>
              <span>{opt.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function RiderProfileSection() {
  const rider = useStore((s) => s.rider)
  const setRiderWeight = useStore((s) => s.setRiderWeight)
  const resetRider = useStore((s) => s.resetRider)

  return (
    <div className="tire-card-section">
      <div className="tire-card-section-header">
        <h5 className="tire-section-title">Profil rider</h5>
        <button className="tire-clear-btn" onClick={resetRider}>
          Effacer
        </button>
      </div>

      <div className="tire-property-card">
        <div className="tire-property-header">
          <span className="tire-property-label-text">Poids</span>
        </div>
        <div className="tire-counter">
          <button
            className="tire-counter-btn"
            onClick={() => setRiderWeight(Math.max(40, rider.weight - 1))}
          >
            −
          </button>
          <span className="tire-counter-value">{rider.weight} KG</span>
          <button
            className="tire-counter-btn"
            onClick={() => setRiderWeight(Math.min(200, rider.weight + 1))}
          >
            +
          </button>
        </div>
      </div>

      <ToggleGroup label="Niveau" options={LEVELS} section="niveau" />
      <ToggleGroup label="Pratique" options={PRATIQUES} section="pratique" />
      <ToggleGroup label="Type de Vélo" options={BIKE_TYPES} section="typeDeVelo" />
      <ToggleGroup label="Ressenti" options={RESSENTIS} section="ressenti" />
      <ToggleGroup label="Surface" options={SURFACES} section="surface" />
      <ToggleGroup label="Conditions" options={CONDITIONS} section="conditions" />
    </div>
  )
}
