'use client'

import { useState, useEffect } from 'react'

export default function TirePreview({ type, color, size = 80 }) {
  const [src, setSrc] = useState('')

  useEffect(() => {
    import('../../experience/World/TireCatalog').then((mod) => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      mod.drawTireTexture(type, ctx, size, size)
      if (color) {
        ctx.globalCompositeOperation = 'multiply'
        ctx.fillStyle = color
        ctx.fillRect(0, 0, size, size)
      }
      setSrc(canvas.toDataURL())
    })
  }, [type, color, size])

  return src ? <img src={src} alt="" /> : null
}
