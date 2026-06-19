'use client'

import { useStore } from '../../store/useStore'

export default function TireConfigSection() {
  const tireWidth = useStore((s) => s.tireWidth)
  const tireDiameter = useStore((s) => s.tireDiameter)
  const incrementWidth = useStore((s) => s.incrementWidth)
  const decrementWidth = useStore((s) => s.decrementWidth)
  const cycleDiameter = useStore((s) => s.cycleDiameter)

  return (
    <div className="tire-card-section">
      <h5 className="tire-section-title">Dimensions du pneu</h5>
      <div className="tire-property-card">
        <div className="tire-property-header">
          <span className="tire-property-label-text">Section</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#27509B">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </div>
        <div className="tire-counter">
          <button className="tire-counter-btn" onClick={decrementWidth}>−</button>
          <span className="tire-counter-value">{tireWidth} MM</span>
          <button className="tire-counter-btn" onClick={incrementWidth}>+</button>
        </div>
      </div>
      <div className="tire-property-card" style={{ marginTop: '0.75rem' }}>
        <div className="tire-property-header">
          <span className="tire-property-label-text">Diamètre</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#27509B">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </div>
        <div className="tire-counter">
          <button className="tire-counter-btn" onClick={cycleDiameter}>−</button>
          <span className="tire-counter-value">{tireDiameter}</span>
          <button className="tire-counter-btn" onClick={cycleDiameter}>+</button>
        </div>
      </div>
    </div>
  )
}
