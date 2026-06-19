import { TIRE_PATTERNS } from '../experience/World/TireCatalog'

export function computeMatch(p, rider) {
  let score = 50
  const { niveau, pratique, surface, typeDeVelo, ressenti, conditions } = rider

  if (niveau.includes('competition')) {
    if (p.grip >= 4) score += 15
    if (p.category === 'Course') score += 10
  }
  if (niveau.includes('entrainement')) {
    if (p.durability >= 3) score += 10
  }
  if (niveau.includes('debutant')) {
    if (p.durability >= 3) score += 5
  }

  if (pratique.includes('gravel') && (p.category === 'Collection' || p.grip >= 4)) score += 15
  if (pratique.includes('vtt') && p.grip >= 4) score += 15
  if (pratique.includes('piste') && p.category === 'Course') score += 15
  if (pratique.includes('ebike') && p.durability >= 4) score += 10

  if (typeDeVelo.includes('course_sur_route') && p.category === 'Course') score += 10
  if (typeDeVelo.includes('endurance_route') && p.durability >= 3) score += 8
  if (typeDeVelo.includes('ville') && p.durability >= 3) score += 8
  if (typeDeVelo.includes('trail') && p.grip >= 4) score += 10
  if (typeDeVelo.includes('enduro') && p.grip >= 4 && p.durability >= 4) score += 10
  if (typeDeVelo.includes('dh') && p.grip >= 5) score += 10
  if (typeDeVelo.includes('triathlon') && p.roughness <= 0.6) score += 8
  if (typeDeVelo.includes('course_piste') && p.category === 'Course') score += 10
  if (typeDeVelo.includes('touring') && p.durability >= 4) score += 8
  if (typeDeVelo.includes('cargo') && p.durability >= 4) score += 8
  if (typeDeVelo.includes('backpacking') && p.durability >= 4) score += 8

  if (surface.includes('asphalte_lisse') && p.roughness <= 0.6) score += 10
  if (surface.includes('asphalte_rugueux') && p.roughness >= 0.7) score += 10
  if (surface.includes('mixte') && p.durability >= 3) score += 10
  if (surface.includes('gravel_leger') && p.grip >= 3) score += 10
  if (surface.includes('paves') && p.durability >= 3) score += 8
  if (surface.includes('compact') && p.roughness >= 0.7) score += 8
  if (surface.includes('fin_meuble') && p.grip >= 4) score += 8
  if (surface.includes('grossier_meuble') && p.grip >= 4 && p.durability >= 3) score += 10
  if (surface.includes('boue') && (p.id === 'diamond' || p.id === 'block')) score += 15

  if (ressenti.includes('reactif') && p.grip >= 4) score += 10
  if (ressenti.includes('equilibre') && p.grip >= 3 && p.durability >= 3) score += 10
  if (ressenti.includes('souple') && p.roughness >= 0.7) score += 8

  if (conditions.includes('sec') && p.grip >= 3) score += 5
  if (conditions.includes('humide') && p.grip >= 4) score += 10
  if (conditions.includes('mixte') && p.durability >= 3) score += 5

  return Math.min(100, Math.max(20, score))
}

export function findBestMatch(rider) {
  let best = null
  let bestScore = 0
  for (const p of TIRE_PATTERNS) {
    const score = computeMatch(p, rider)
    if (score > bestScore) {
      bestScore = score
      best = p
    }
  }
  return { pattern: best, score: bestScore }
}

export function getFeatures(p) {
  const f = []
  if (p.grip >= 4) f.push('Compétition')
  if (p.durability >= 4) f.push('Endurance')
  if (p.grip >= 3 && p.durability >= 3) f.push('Polyvalent')
  f.push(p.category)
  return f
}
