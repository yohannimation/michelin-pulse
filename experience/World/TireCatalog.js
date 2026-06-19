export const TIRE_PATTERNS = [
  {
    id: 'slick',
    name: 'Route',
    desc: 'Profil rapide pour le bitume et les sorties soutenues',
    roughness: 0.6,
    metalness: 0,
    category: 'Route',
    grip: 2,
    durability: 3,
    badge: null,
  },
  {
    id: 'sport',
    name: 'Endurance',
    desc: 'Polyvalent pour les longues sorties et l&apos;usage régulier',
    roughness: 0.9,
    metalness: 0,
    category: 'Route',
    grip: 3,
    durability: 3,
    badge: 'Best-seller',
  },
  {
    id: 'classic',
    name: 'All Season',
    desc: 'Accroche régulière pour rouler toute l&apos;année',
    roughness: 0.8,
    metalness: 0,
    category: 'Route',
    grip: 3,
    durability: 4,
    badge: null,
  },
  {
    id: 'performance',
    name: 'Race',
    desc: 'Profil affûté pour la compétition sur route',
    roughness: 0.6,
    metalness: 0.1,
    category: 'Course',
    grip: 5,
    durability: 3,
    badge: 'Compétition',
  },
  {
    id: 'vintage',
    name: 'Classic',
    desc: 'Look rétro pour les vélos de collection',
    roughness: 1,
    metalness: 0,
    category: 'Collection',
    grip: 2,
    durability: 3,
    badge: null,
  },
  {
    id: 'track',
    name: 'Gravel Fast',
    desc: 'Texturé pour garder du rendement sur terrain mixte',
    roughness: 0.3,
    metalness: 0.4,
    category: 'Course',
    grip: 5,
    durability: 2,
    badge: 'Nouveau',
  },
  {
    id: 'diamond',
    name: 'Gravel Grip',
    desc: 'Losanges pour gagner en motricité sur les chemins',
    roughness: 0.9,
    metalness: 0,
    category: 'Collection',
    grip: 4,
    durability: 4,
    badge: null,
  },
  {
    id: 'block',
    name: 'Trail',
    desc: 'Blocs agressifs pour les terrains meubles et engagés',
    roughness: 0.95,
    metalness: 0,
    category: 'Collection',
    grip: 4,
    durability: 5,
    badge: null,
  },
]

export const TIRE_COLORS = [
  { id: 'noir', name: 'Noir', color: '#1a1a1a' },
  { id: 'gris', name: 'Gris foncé', color: '#2d2d2d' },
  { id: 'bleu', name: 'Bleu Michelin', color: '#27509B' },
  { id: 'bleu_fonce', name: 'Bleu nuit', color: '#00205B' },
  { id: 'blanc', name: 'Blanc', color: '#e8e8e8' },
  { id: 'brun', name: 'Brun vintage', color: '#4a3520' },
  { id: 'rouge', name: 'Rouge', color: '#8B1A1A' },
  { id: 'jaune', name: 'Jaune Michelin', color: '#FCE500' },
]

export const TIRE_MODELS = [
  {
    id: 'road-pro',
    name: 'Road Pro',
    desc: 'Rendement maximal pour la route',
    color: '#1a1a1a',
    roughness: 0.55,
    metalness: 0,
    textureType: 'slick',
    category: 'Route',
    usage: 'Sorties rapides',
    grip: 2,
    durability: 3,
  },
  {
    id: 'endurance',
    name: 'Endurance',
    desc: 'Compromis confort et rendement',
    color: '#1a1a1a',
    roughness: 0.9,
    metalness: 0,
    textureType: 'sport',
    category: 'Route',
    usage: 'Longues sorties',
    grip: 4,
    durability: 4,
  },
  {
    id: 'all-season',
    name: 'All Season',
    desc: 'Adhérence régulière toute l&apos;année',
    color: '#2d2d2d',
    roughness: 0.8,
    metalness: 0,
    textureType: 'classic',
    category: 'Route',
    usage: 'Polyvalent',
    grip: 3,
    durability: 4,
  },
  {
    id: 'race',
    name: 'Race',
    desc: 'Profil affûté pour la compétition',
    color: '#00205B',
    roughness: 0.6,
    metalness: 0.1,
    textureType: 'performance',
    category: 'Course',
    usage: 'Compétition',
    grip: 5,
    durability: 3,
  },
  {
    id: 'classic',
    name: 'Classic',
    desc: 'Look rétro pour les montages vintage',
    color: '#4a3520',
    roughness: 1,
    metalness: 0,
    textureType: 'vintage',
    category: 'Collection',
    usage: 'Esthétique',
    grip: 2,
    durability: 3,
  },
  {
    id: 'gravel-fast',
    name: 'Gravel Fast',
    desc: 'Rapide sur les pistes roulantes',
    color: '#0a0a0a',
    roughness: 0.35,
    metalness: 0.2,
    textureType: 'track',
    category: 'Gravel',
    usage: 'Terrain roulant',
    grip: 4,
    durability: 3,
  },
  {
    id: 'gravel-grip',
    name: 'Gravel Grip',
    desc: 'Motricité renforcée sur chemins mixtes',
    color: '#1f1f1f',
    roughness: 0.9,
    metalness: 0,
    textureType: 'diamond',
    category: 'Gravel',
    usage: 'Chemins engagés',
    grip: 5,
    durability: 4,
  },
  {
    id: 'trail',
    name: 'Trail',
    desc: 'Accroche maximale en terrain meuble',
    color: '#222222',
    roughness: 0.95,
    metalness: 0,
    textureType: 'block',
    category: 'Trail',
    usage: 'Boue et sentiers',
    grip: 5,
    durability: 5,
  },
]

export function getTireModelById(id) {
  return TIRE_MODELS.find((model) => model.id === id) || TIRE_MODELS[0]
}

export function getTireModelByTextureType(textureType) {
  return TIRE_MODELS.find((model) => model.textureType === textureType) || TIRE_MODELS[0]
}

export function drawTireTexture(type, ctx, width, height) {
  const w = width
  const h = height
  switch(type) {
    case 'slick':
      ctx.fillStyle = '#111'
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#1a1a1a'
      for (let i = 0; i < 80; i++) {
        const y = i * (h / 80)
        ctx.fillRect(0, y, w, 1)
      }
      break
    case 'sport':
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = '#333'
      ctx.lineWidth = Math.max(2, w / 128)
      for (let i = 0; i < 32; i++) {
        const y = i * (h / 32)
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y + (h / 64))
        ctx.stroke()
      }
      break
    case 'classic':
      ctx.fillStyle = '#2d2d2d'
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = '#4a4a4a'
      ctx.lineWidth = Math.max(1, w / 256)
      for (let i = 0; i < 64; i++) {
        const y = i * (h / 64)
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }
      break
    case 'performance':
      ctx.fillStyle = '#00205B'
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = '#1a3a7a'
      ctx.lineWidth = Math.max(2, w / 170)
      for (let i = 0; i < 40; i++) {
        const y = i * (h / 40)
        ctx.beginPath()
        ctx.moveTo(0, y + (h / 100))
        ctx.lineTo(w, y - (h / 100))
        ctx.stroke()
      }
      break
    case 'vintage':
      ctx.fillStyle = '#4a3520'
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = '#6b4c30'
      ctx.lineWidth = Math.max(2, w / 170)
      const rows = 20
      const cols = 8
      for (let i = 0; i < rows; i++) {
        const y = i * (h / rows)
        for (let x = 0; x < cols; x++) {
          ctx.beginPath()
          ctx.moveTo(x * (w / cols), y)
          ctx.lineTo(x * (w / cols) + (w / (cols * 2)), y + (h / (rows * 2)))
          ctx.lineTo(x * (w / cols) + (w / cols), y)
          ctx.stroke()
        }
      }
      break
    case 'track':
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, w, h)
      const step = Math.max(2, w / 128)
      for (let i = 0; i < w; i += step) {
        for (let j = 0; j < h; j += step) {
          const v = 5 + Math.random() * 25
          ctx.fillStyle = `rgb(${v},${v},${v})`
          ctx.fillRect(i, j, step, step)
        }
      }
      break
    case 'diamond':
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#333'
      const dSize = Math.max(8, w / 32)
      for (let i = 0; i < w + dSize; i += dSize * 2) {
        for (let j = 0; j < h + dSize; j += dSize * 2) {
          ctx.beginPath()
          ctx.moveTo(i + dSize / 2, j)
          ctx.lineTo(i + dSize, j + dSize / 2)
          ctx.lineTo(i + dSize / 2, j + dSize)
          ctx.lineTo(i, j + dSize / 2)
          ctx.closePath()
          ctx.fill()
        }
      }
      break
    case 'block':
      ctx.fillStyle = '#222'
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#444'
      const bSize = Math.max(12, w / 24)
      for (let i = 0; i < w; i += bSize * 2) {
        for (let j = 0; j < h; j += bSize * 2) {
          const offset = (Math.floor(j / (bSize * 2)) % 2) * bSize
          ctx.fillRect(i + offset, j, bSize * 0.8, bSize * 0.8)
        }
      }
      break
    default:
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(0, 0, w, h)
  }
}

export function getTirePreviewUrl(type, size = 160) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  drawTireTexture(type, ctx, size, size)
  return canvas.toDataURL()
}
