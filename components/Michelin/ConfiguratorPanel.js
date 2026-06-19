'use client'

import { useEffect, useState, useRef } from 'react'
import { useStore } from '../../store/useStore'
import TiresSection from './TiresSection'
import ResellersModal from './ResellersModal'
import TireConfigSection from './TireConfigSection'
import PressureSection from './PressureSection'
import RiderProfileSection from './RiderProfileSection'
import ColorsSection from './ColorsSection'
import TireQuiz from './TireQuiz'

export default function ConfiguratorPanel() {
  const panelOpen = useStore((s) => s.panelOpen)
  const panelStartQuiz = useStore((s) => s.panelStartQuiz)
  const consumePanelStartQuiz = useStore((s) => s.consumePanelStartQuiz)
  const closePanel = useStore((s) => s.closePanel)
  const [quizActive, setQuizActive] = useState(false)
  const [resellersModalOpen, setResellersModalOpen] = useState(false)
  const bodyRef = useRef(null)

  useEffect(() => {
    if (panelOpen && panelStartQuiz) {
      setQuizActive(true)
      consumePanelStartQuiz()
    }
  }, [panelOpen, panelStartQuiz, consumePanelStartQuiz])

  useEffect(() => {
    if (!panelOpen) {
      setQuizActive(false)
    }
  }, [panelOpen])

  function handleQuizComplete() {
    setQuizActive(false)
    setTimeout(() => {
      const firstCard = bodyRef.current?.querySelector('.tire-card-section')
      if (firstCard) {
        firstCard.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  return (
    <div className="tire-panel" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="tire-panel-header">
        <div className="tire-panel-logo">
          <img src="/images/Michelin-logo.png" alt="Michelin" className="tire-panel-logo-img" />
          <div className="tire-panel-logo-text">
            <span className="tire-panel-logo-michelin">MICHELIN</span>
            <span className="tire-panel-logo-sub">VÉLO</span>
          </div>
        </div>
        <div className="tire-panel-header-right">
          <button className="tire-panel-close" onClick={closePanel}>
            <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="tire-panel-body" ref={bodyRef}>
        {quizActive ? (
          <TireQuiz onComplete={handleQuizComplete} />
        ) : (
          <>
            <div className="tire-quiz-trigger" onClick={() => setQuizActive(true)}>
              <div className="tire-quiz-trigger-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 8v5M12 16v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="tire-quiz-trigger-text">
                <span className="tire-quiz-trigger-title">Trouver mon pneu idéal</span>
                <span className="tire-quiz-trigger-sub">Quiz personnalisé en 6 questions →</span>
              </div>
            </div>
            <TiresSection />
            <TireConfigSection />
            <PressureSection />
            <RiderProfileSection />
            <ColorsSection />

            <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
              <button
                onClick={() => setResellersModalOpen(true)}
                style={{
                  width: '100%',
                  height: '56px',
                  backgroundColor: '#FCE500',
                  color: '#00205B',
                  border: 'none',
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 8px 20px rgba(252,229,0,0.2)',
                  transition: 'transform 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Trouver un revendeur
              </button>
            </div>
          </>
        )}
      </div>

      {resellersModalOpen && (
        <ResellersModal onClose={() => setResellersModalOpen(false)} />
      )}
    </div>
  )
}
