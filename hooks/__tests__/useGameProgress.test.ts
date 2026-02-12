import { renderHook, act } from '@testing-library/react'
import { useGameProgress } from '../useGameProgress'
import { useGameStore } from '@/store/gameStore'
import { StepId } from '@/types/step'
import { MissionId } from '@/types/mission'

describe('useGameProgress', () => {
  beforeEach(() => {
    localStorage.clear()
    useGameStore.getState().reset()
  })

  it('devrait retourner les valeurs du store', () => {
    const { result } = renderHook(() => useGameProgress())

    expect(result.current.currentMissionId).toBeNull()
    expect(result.current.currentStepId).toBeNull()
    expect(result.current.completedSteps).toEqual([])
    expect(result.current.completedMissions).toEqual([])
  })

  it('devrait vérifier si un step est complété', () => {
    const { result } = renderHook(() => useGameProgress())

    act(() => {
      result.current.completeStep('step-1' as StepId)
    })

    expect(result.current.isStepCompleted('step-1' as StepId)).toBe(true)
    expect(result.current.isStepCompleted('step-2' as StepId)).toBe(false)
  })

  it('devrait vérifier si une mission est complétée', () => {
    const { result } = renderHook(() => useGameProgress())

    act(() => {
      result.current.completeMission('mission-1' as MissionId)
    })

    expect(result.current.isMissionCompleted('mission-1' as MissionId)).toBe(true)
    expect(result.current.isMissionCompleted('mission-2' as MissionId)).toBe(false)
  })

  it('devrait exposer les méthodes du store', () => {
    const { result } = renderHook(() => useGameProgress())

    act(() => {
      result.current.setCurrentMissionId('mission-1' as MissionId)
      result.current.setCurrentStepId('step-1' as StepId)
      result.current.completeStep('step-1' as StepId)
      result.current.completeMission('mission-1' as MissionId)
      result.current.resetMissionSteps(['step-1' as StepId])
      result.current.reset()
    })

    expect(result.current.currentMissionId).toBeNull()
    expect(result.current.currentStepId).toBeNull()
    expect(result.current.completedSteps).toEqual([])
    expect(result.current.completedMissions).toEqual([])
  })
})
