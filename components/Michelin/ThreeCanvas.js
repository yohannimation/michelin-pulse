'use client'

import { useRef, useEffect } from 'react'
import Experience from '../../experience/Experience'

export default function ThreeCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const experience = new Experience(canvasRef.current)
    return () => {
      experience.destroy()
    }
  }, [])

  return <canvas ref={canvasRef} className="experience-canvas" />
}
