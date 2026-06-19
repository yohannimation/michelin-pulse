'use client'

import { useStore } from '../../store/useStore'
import { useMemo } from 'react'

export default function PressureSection() {
  const weight = useStore((s) => s.rider.weight) || 70
  const tireWidth = useStore((s) => s.tireWidth) || 28

  const { front, rear } = useMemo(() => {
    // Basic heuristic calculation:
    // Base pressure roughly weight / 15 for a 28mm tire.
    // +0.1 bar per mm narrower, -0.1 bar per mm wider.
    const basePressure = weight / 15
    const widthAdjustment = (28 - tireWidth) * 0.1
    let frontPressure = basePressure + widthAdjustment
    
    // Minimum 3 bars, maximum 8 bars for safety limits
    frontPressure = Math.max(3.0, Math.min(8.0, frontPressure))
    let rearPressure = frontPressure * 1.05 // Rear takes more weight

    return {
      front: frontPressure.toFixed(2),
      rear: rearPressure.toFixed(2)
    }
  }, [weight, tireWidth])

  return (
    <div className="tire-card-section">
      <h5 className="tire-section-title">Pression recommandée</h5>
      <div className="tire-property-card">
        <div className="tire-pressure-row">
          <span className="tire-pressure-label">Avant</span>
          <span className="tire-pressure-value">{front} bar</span>
        </div>
        <div className="tire-pressure-divider" />
        <div className="tire-pressure-row">
          <span className="tire-pressure-label">Arrière</span>
          <span className="tire-pressure-value">{rear} bar</span>
        </div>
      </div>
    </div>
  )
}
