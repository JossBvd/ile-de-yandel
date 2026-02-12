import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QCMGame } from '../QCMGame'
import { Step, QCMGameData } from '@/types/step'

const mockStep: Step = {
  id: 'test-step',
  title: 'Test Question',
  instruction: 'Choisissez la bonne réponse',
  game: {
    type: 'qcm',
    question: 'Quelle est la capitale de la France ?',
    options: [
      { id: 'A', text: 'Paris' },
      { id: 'B', text: 'Lyon' },
      { id: 'C', text: 'Marseille' },
      { id: 'D', text: 'Toulouse' },
    ],
    correctAnswers: [0],
  } as QCMGameData,
}

describe('QCMGame', () => {
  const mockOnComplete = jest.fn()
  const mockOnDefeat = jest.fn()
  const mockOnGoBackToMap = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('devrait afficher la question et les options', () => {
    render(
      <QCMGame
        step={mockStep}
        onComplete={mockOnComplete}
        onDefeat={mockOnDefeat}
        onGoBackToMap={mockOnGoBackToMap}
      />
    )

    expect(screen.getByText('Test Question')).toBeInTheDocument()
    expect(screen.getByText('Quelle est la capitale de la France ?')).toBeInTheDocument()
    expect(screen.getByText('Paris')).toBeInTheDocument()
    expect(screen.getByText('Lyon')).toBeInTheDocument()
    expect(screen.getByText('Marseille')).toBeInTheDocument()
    expect(screen.getByText('Toulouse')).toBeInTheDocument()
  })

  it('devrait permettre de sélectionner une option', () => {
    render(
      <QCMGame
        step={mockStep}
        onComplete={mockOnComplete}
        onDefeat={mockOnDefeat}
        onGoBackToMap={mockOnGoBackToMap}
      />
    )

    const parisButton = screen.getByText('Paris').closest('button')
    expect(parisButton).toBeInTheDocument()
    
    fireEvent.click(parisButton!)
    
    expect(screen.getByText(/Correction question/)).toBeInTheDocument()
  })

  it('devrait afficher la correction après sélection', () => {
    render(
      <QCMGame
        step={mockStep}
        onComplete={mockOnComplete}
        onDefeat={mockOnDefeat}
        onGoBackToMap={mockOnGoBackToMap}
      />
    )

    const parisButton = screen.getByText('Paris').closest('button')
    fireEvent.click(parisButton!)

    expect(screen.getByText(/Correction question/)).toBeInTheDocument()
  })

  it('devrait appeler onComplete quand la réponse est correcte et le bouton Terminer est cliqué', async () => {
    render(
      <QCMGame
        step={mockStep}
        onComplete={mockOnComplete}
        onDefeat={mockOnDefeat}
        onGoBackToMap={mockOnGoBackToMap}
      />
    )

    const parisButton = screen.getByText('Paris').closest('button')
    fireEvent.click(parisButton!)

    await waitFor(() => {
      const terminerButton = screen.getByText('Terminer')
      expect(terminerButton).toBeInTheDocument()
    })

    const terminerButton = screen.getByText('Terminer')
    fireEvent.click(terminerButton)

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1)
    })
  })

  it('devrait afficher le bouton Rejouer si la réponse est incorrecte', async () => {
    const incorrectStep: Step = {
      ...mockStep,
      game: {
        ...mockStep.game,
        correctAnswers: [0],
      } as QCMGameData,
    }

    render(
      <QCMGame
        step={incorrectStep}
        onComplete={mockOnComplete}
        onDefeat={mockOnDefeat}
        onGoBackToMap={mockOnGoBackToMap}
      />
    )

    const lyonButton = screen.getByText('Lyon').closest('button')
    fireEvent.click(lyonButton!)

    await waitFor(() => {
      const rejouerButton = screen.getByText('Rejouer')
      expect(rejouerButton).toBeInTheDocument()
    })
  })

  it('ne devrait pas permettre de sélectionner une option après correction', () => {
    render(
      <QCMGame
        step={mockStep}
        onComplete={mockOnComplete}
        onDefeat={mockOnDefeat}
        onGoBackToMap={mockOnGoBackToMap}
      />
    )

    const parisButton = screen.getByText('Paris').closest('button')
    fireEvent.click(parisButton!)

    const lyonButton = screen.getByText('Lyon').closest('button')
    expect(lyonButton).toBeDisabled()
  })
})
