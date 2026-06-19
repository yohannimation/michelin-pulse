'use client'

import { useStore } from '../../store/useStore'
import { getTireModelByTextureType } from '../../experience/World/TireCatalog'
import { computeMatch as getMatch, getFeatures } from '../../utils/tireMatcher'

export default function TiresSection() {
  const patterns = useStore((s) => s.patterns)
  const activePattern = useStore((s) => s.activePattern)
  const activeColor = useStore((s) => s.activeColor)
  const rider = useStore((s) => s.rider)
  const setActivePattern = useStore((s) => s.setActivePattern)
  const setActiveTireModel = useStore((s) => s.setActiveTireModel)

  const handleSelect = (id) => {
    setActivePattern(id)
    const model = getTireModelByTextureType(id)
    setActiveTireModel(model.id)
    import('../../experience/Experience').then((mod) => {
      const bike = mod.default.instance?.world?.bike
      if (bike) {
        bike.applyTireVariant(model.id, activeColor)
      }
    })
  }

  return (
    <div className="tire-card-section">
      <div className="tire-card-section-header">
        <h5 className="tire-section-title">Vos pneus Michelin Vélo</h5>
        <div className="tire-section-badge">{patterns.length} modèles</div>
      </div>
      <div className="tire-card-grid">
        {patterns.map((p) => {
          const sel = activePattern === p.id
          return (
            <button
              key={p.id}
              className={`tire-product-card${sel ? ' selected' : ''}`}
              onClick={() => handleSelect(p.id)}
            >
              <div className="tire-product-card-img">
                <img src="/images/pneu.png" alt={p.name} />
              </div>
              <div className="tire-product-card-info">
                <div className="tire-product-card-title-row">
                  <span className="tire-product-card-name">{p.name}</span>
                  <span className="tire-product-card-size">Route · Gravel</span>
                </div>
                <span className="tire-product-card-match">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#27509B">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  {getMatch(p, rider)}%
                </span>
                <div className="tire-product-card-features">
                  {getFeatures(p).map((f) => (
                    <span key={f} className="tire-product-card-feature">✓ {f}</span>
                  ))}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
