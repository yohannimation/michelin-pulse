'use client'

import { useStore } from '../../store/useStore'
import { computeMatch } from '../../utils/tireMatcher'
import { getTireModelById } from '../../experience/World/TireCatalog'
import TirePreview from './TirePreview'

export default function TireShowcaseSection() {
  const rider = useStore((s) => s.rider)
  const activeColor = useStore((s) => s.activeColor)
  const activeTireModel = useStore((s) => s.activeTireModel)
  const model = getTireModelById(activeTireModel)
  const match = computeMatch({
    id: model.textureType,
    category: model.category,
    grip: model.grip,
    durability: model.durability,
    roughness: model.roughness,
  }, rider)

  return (
    <section className="tire-showcase">
      <div className="tire-showcase-kicker">
        <span>VOS PNEUS IDÉAUX</span>
      </div>
      <div className="tire-showcase-card">
        <div className="tire-showcase-visual">
          <TirePreview type={model.textureType} color={activeColor} size={118} />
        </div>
        <div className="tire-showcase-content">
          <div className="tire-showcase-topline">
            <h3 className="tire-showcase-title">{model.name}</h3>
            <span className="tire-showcase-subtitle">{model.category}</span>
          </div>
          <div className="tire-showcase-match">Michelin Match : {match}%</div>
          <div className="tire-showcase-features">
            <span>✓ {model.usage}</span>
            <span>✓ {model.category}</span>
            <span>✓ {model.desc}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
