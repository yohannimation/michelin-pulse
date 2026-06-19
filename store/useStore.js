'use client'

import { create } from 'zustand'

const defaultRider = {
  weight: 70,
  niveau: [],
  pratique: [],
  typeDeVelo: [],
  ressenti: [],
  surface: [],
  conditions: [],
}

export const useStore = create((set) => ({
  panelOpen: false,
  panelStartQuiz: false,
  activePattern: 'slick',
  activeTireModel: 'road-pro',
  activeColor: '#1a1a1a',
  tireWidth: 28,
  tireDiameter: '700C',
  patterns: [],
  colors: [],
  rider: { ...defaultRider },

  togglePanel: () => set((s) => ({ panelOpen: !s.panelOpen })),
  openPanel: () => set({ panelOpen: true, panelStartQuiz: false }),
  closePanel: () => set({ panelOpen: false, panelStartQuiz: false }),
  openPanelWithQuiz: () => set({ panelOpen: true, panelStartQuiz: true }),
  consumePanelStartQuiz: () => set({ panelStartQuiz: false }),

  setPatterns: (patterns) => set({ patterns }),
  setColors: (colors) => set({ colors }),

  setActivePattern: (id) => set({ activePattern: id }),
  setActiveTireModel: (id) => set({ activeTireModel: id }),
  setActiveColor: (color) => set({ activeColor: color }),

  incrementWidth: () => set((s) => {
    const widths = [25, 28, 30, 32, 35, 40, 45]
    const idx = widths.indexOf(s.tireWidth)
    if (idx < widths.length - 1) return { tireWidth: widths[idx + 1] }
    return {}
  }),
  decrementWidth: () => set((s) => {
    const widths = [25, 28, 30, 32, 35, 40, 45]
    const idx = widths.indexOf(s.tireWidth)
    if (idx > 0) return { tireWidth: widths[idx - 1] }
    return {}
  }),
  cycleDiameter: () => set((s) => {
    const diams = ['700C', '650B']
    const idx = diams.indexOf(s.tireDiameter)
    return { tireDiameter: diams[(idx + 1) % diams.length] }
  }),

  toggleRider: (section, value) =>
    set((s) => ({
      rider: {
        ...s.rider,
        [section]: s.rider[section].includes(value)
          ? s.rider[section].filter((v) => v !== value)
          : [...s.rider[section], value],
      },
    })),

  setRiderWeight: (w) =>
    set((s) => ({ rider: { ...s.rider, weight: w } })),

  resetRider: () => set({ rider: { ...defaultRider } }),
}))
