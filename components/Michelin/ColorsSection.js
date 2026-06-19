'use client'

import { useStore } from '../../store/useStore'

export default function ColorsSection() {
  const colors = useStore((s) => s.colors)
  const activeColor = useStore((s) => s.activeColor)
  const setActiveColor = useStore((s) => s.setActiveColor)
  const activeTireModel = useStore((s) => s.activeTireModel)

  const handleSelect = (color) => {
    setActiveColor(color)
    import('../../experience/Experience').then((mod) => {
      const bike = mod.default.instance?.world?.bike
      if (bike) {
        bike.applyTireVariant(activeTireModel, color)
      }
    })
  }

  return (
    <div className="tire-card-section">
      <h5 className="tire-section-title">Couleurs</h5>
      <div className="tire-color-picker">
        {colors.map((c) => (
          <button
            key={c.id}
            className={`tire-color-swatch${activeColor === c.color ? ' active' : ''}`}
            style={{ backgroundColor: c.color }}
            onClick={() => handleSelect(c.color)}
            title={c.name}
          />
        ))}
      </div>
    </div>
  )
}
