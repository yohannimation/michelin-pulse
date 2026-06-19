'use client'

import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { getTireModelByTextureType } from '../../experience/World/TireCatalog'
import { findBestMatch } from '../../utils/tireMatcher'


const LEVELS = [
  { id: 'competition', label: 'Compétition', icon: '🏆' },
  { id: 'entrainement', label: 'Entraînement', icon: '🚴' },
  { id: 'loisir', label: 'Loisir', icon: '🚲' },
  { id: 'debutant', label: 'Débutant', icon: '🌱' },
]

const PRATIQUES = [
  { id: 'vtt', label: 'VTT' },
  { id: 'gravel', label: 'Gravel' },
  { id: 'piste', label: 'Piste' },
  { id: 'ebike', label: 'E-Bike' },
]

const BIKE_TYPES = [
  { id: 'trail', label: 'Trail' },
  { id: 'enduro', label: 'Enduro' },
  { id: 'dh', label: 'DH' },
  { id: 'triathlon', label: 'Triathlon' },
  { id: 'course_sur_route', label: 'Course sur route' },
  { id: 'endurance_route', label: 'Endurance sur route' },
  { id: 'course_piste', label: 'Course sur piste' },
  { id: 'ville', label: 'Ville' },
  { id: 'touring', label: 'Touring' },
  { id: 'cargo', label: 'Cargo' },
  { id: 'backpacking', label: 'Backpacking' },
]

const SURFACES = [
  { id: 'asphalte_lisse', label: 'Asphalte lisse' },
  { id: 'asphalte_rugueux', label: 'Asphalte rugueux' },
  { id: 'gravel_leger', label: 'Gravel léger' },
  { id: 'paves', label: 'Pavés' },
  { id: 'compact', label: 'Compact' },
  { id: 'fin_meuble', label: 'Fin et meuble' },
  { id: 'mixte', label: 'Mixte' },
  { id: 'grossier_meuble', label: 'Grossier et meuble' },
  { id: 'boue', label: 'Boue' },
]

const CONDITIONS = [
  { id: 'sec', label: 'Sec' },
  { id: 'mixte', label: 'Mixte' },
  { id: 'humide', label: 'Humide' },
]

const RESSENTIS = [
  { id: 'reactif', label: 'Réactif' },
  { id: 'equilibre', label: 'Équilibré' },
  { id: 'souple', label: 'Souple' },
]

const STEPS = [
  { section: 'niveau', question: 'Quel est votre niveau ?', subtitle: 'Sélectionnez votre pratique', options: LEVELS, multi: false },
  { section: 'pratique', question: 'Quelle est votre pratique ?', subtitle: 'Choisissez une ou plusieurs pratiques', options: PRATIQUES, multi: true },
  { section: 'typeDeVelo', question: 'Quel type de vélo utilisez-vous ?', subtitle: 'Sélectionnez un ou plusieurs types', options: BIKE_TYPES, multi: true },
  { section: 'surface', question: 'Sur quelle surface roulez-vous ?', subtitle: 'Choisissez une ou plusieurs surfaces', options: SURFACES, multi: true },
  { section: 'conditions', question: 'Dans quelles conditions roulez-vous ?', subtitle: '', options: CONDITIONS, multi: true },
  { section: 'ressenti', question: 'Quel ressenti recherchez-vous ?', subtitle: '', options: RESSENTIS, multi: false },
]

export default function TireQuiz({ onComplete }) {
  const rider = useStore((s) => s.rider)
  const toggleRider = useStore((s) => s.toggleRider)
  const setActivePattern = useStore((s) => s.setActivePattern)
  const setActiveTireModel = useStore((s) => s.setActiveTireModel)
  const activeColor = useStore((s) => s.activeColor)

  const [step, setStep] = useState(0)
  const currentStep = STEPS[step - 1] || null

  function hasSelection(stepIndex) {
    const s = STEPS[stepIndex]
    if (!s) return false
    const vals = rider[s.section] || []
    return vals.length > 0
  }

  function handleOptionClick(section, id) {
    toggleRider(section, id)
  }

  function handleNext() {
    if (step < STEPS.length) {
      setStep(step + 1)
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  function handleFinish() {
    setStep(STEPS.length + 1)
  }

  function handleChooseTire() {
    const result = findBestMatch(rider)
    if (result.pattern) {
      setActivePattern(result.pattern.id)
      const model = getTireModelByTextureType(result.pattern.id)
      setActiveTireModel(model.id)
      import('../../experience/Experience').then((mod) => {
        const bike = mod.default.instance?.world?.bike
        if (bike) {
          bike.applyTireVariant(model.id, activeColor)
        }
      })
    }
    onComplete(result)
  }

  const progressPercent = step === 0 ? 0 : ((step - 1) / STEPS.length) * 100

  if (step === 0) {
    return (
      <div className="tire-quiz-container">
        <div className="tire-quiz-intro">
          <div className="tire-quiz-intro-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="#27509B">
              <circle cx="24" cy="24" r="20" stroke="#27509B" strokeWidth="2" fill="none" />
              <path d="M24 12v12l8 8" stroke="#27509B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="24" cy="24" r="4" fill="#27509B" />
            </svg>
          </div>
          <h3 className="tire-quiz-title">Trouvez votre pneu Michelin Vélo</h3>
          <p className="tire-quiz-desc">
            Répondez à quelques questions simples pour découvrir le pneu Michelin
            le plus adapté à votre pratique, votre terrain et votre rythme.
          </p>
          <div className="tire-quiz-benefits">
            <div className="tire-quiz-benefit">
              <span className="tire-quiz-benefit-check">✓</span>
              <span>6 questions rapides</span>
            </div>
            <div className="tire-quiz-benefit">
              <span className="tire-quiz-benefit-check">✓</span>
              <span>Recommandation personnalisée</span>
            </div>
            <div className="tire-quiz-benefit">
              <span className="tire-quiz-benefit-check">✓</span>
              <span>Visualisation 3D instantanée</span>
            </div>
          </div>
          <button className="tire-quiz-btn tire-quiz-btn-primary" onClick={handleNext}>
            Commencer
          </button>
        </div>
      </div>
    )
  }

  if (step > STEPS.length) {
    const result = findBestMatch(rider)
    if (!result.pattern) {
      return (
        <div className="tire-quiz-container">
          <div className="tire-quiz-result">
            <p>Aucun pneu ne correspond à vos critères. Ajustez votre profil.</p>
            <button className="tire-quiz-btn tire-quiz-btn-secondary" onClick={() => setStep(0)}>
              Recommencer
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="tire-quiz-container">
        <div className="tire-quiz-result">
             <div className="tire-quiz-result-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FCE500">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Recommandé
          </div>

          <div className={`tire-product-card selected`} style={{ cursor: 'default', width: '100%' }}>
            <div className="tire-product-card-img" style={{ width: 80, height: 80 }}>
              <img src="/images/pneu.png" alt={result.pattern.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="tire-product-card-info">
              <div className="tire-product-card-title-row">
                <span className="tire-product-card-name" style={{ fontSize: '1rem' }}>{result.pattern.name}</span>
              <span className="tire-product-card-size">{result.pattern.desc}</span>
              </div>
              <span className="tire-product-card-match" style={{ fontSize: '0.85rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#27509B">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                {result.score}% de match
              </span>
              <div className="tire-product-card-features">
                {result.pattern.badge && (
                  <span className="tire-quiz-badge">{result.pattern.badge}</span>
                )}
              </div>
            </div>
          </div>

          <div className="tire-quiz-scores">
            <p className="tire-quiz-scores-title">Pourquoi ce pneu vous correspond</p>
            <div className="tire-quiz-score-bar">
              <span>Grip</span>
              <div className="tire-quiz-bar-track">
                <div className="tire-quiz-bar-fill" style={{ width: `${(result.pattern.grip / 5) * 100}%` }} />
              </div>
            </div>
            <div className="tire-quiz-score-bar">
              <span>Durabilité</span>
              <div className="tire-quiz-bar-track">
                <div className="tire-quiz-bar-fill" style={{ width: `${(result.pattern.durability / 5) * 100}%` }} />
              </div>
            </div>
          </div>

          <button className="tire-quiz-btn tire-quiz-btn-primary" onClick={handleChooseTire}>
            Choisir ce pneu
          </button>
          <button className="tire-quiz-btn tire-quiz-btn-ghost" onClick={() => setStep(0)}>
            Recommencer le quiz
          </button>
        </div>
      </div>
    )
  }

  const section = currentStep.section
  const selected = rider[section] || []

  return (
    <div className="tire-quiz-container">
      <div className="tire-quiz-progress">
        <div className="tire-quiz-progress-track">
          <div className="tire-quiz-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <span className="tire-quiz-step-count">{step} / {STEPS.length}</span>
      </div>

      <div className="tire-quiz-question-area">
        <h3 className="tire-quiz-question">{currentStep.question}</h3>
        {currentStep.subtitle && <p className="tire-quiz-subtitle">{currentStep.subtitle}</p>}

        <div className={`tire-quiz-options ${currentStep.multi ? 'multi' : ''}`}>
          {currentStep.options.map((opt) => {
            const isOn = selected.includes(opt.id)
            const cls = `tire-quiz-option${isOn ? ' selected' : ''}${currentStep.multi ? ' multi' : ' single'}`
            return (
              <button
                key={opt.id}
                className={cls}
                onClick={() => handleOptionClick(section, opt.id)}
              >
                {opt.icon && <span className="tire-quiz-option-icon">{opt.icon}</span>}
                <span>{opt.label}</span>
                {isOn && (
                  <svg className="tire-quiz-check" width="18" height="18" viewBox="0 0 24 24" fill="#27509B">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="tire-quiz-nav">
        <button
          className="tire-quiz-btn tire-quiz-btn-secondary"
          onClick={handleBack}
        >
          Retour
        </button>
        {step < STEPS.length ? (
          <button
            className="tire-quiz-btn tire-quiz-btn-primary"
            onClick={handleNext}
            disabled={!hasSelection(step - 1)}
          >
            Suivant
          </button>
        ) : (
          <button
            className="tire-quiz-btn tire-quiz-btn-primary"
            onClick={handleFinish}
            disabled={!hasSelection(step - 1)}
          >
            Voir mon pneu
          </button>
        )}
      </div>
    </div>
  )
}
