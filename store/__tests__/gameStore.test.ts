import { renderHook, act } from '@testing-library/react'
import { useGameStore } from '../gameStore'
import { MissionId } from '@/types/mission'
import { StepId } from '@/types/step'

describe('gameStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useGameStore.getState().reset()
  })

  it('devrait initialiser avec un état vide', () => {
    const { result } = renderHook(() => useGameStore())
    
    expect(result.current.currentMissionId).toBeNull()
    expect(result.current.currentStepId).toBeNull()
    expect(result.current.completedSteps).toEqual([])
    expect(result.current.completedMissions).toEqual([])
  })

  it('devrait définir la mission courante', () => {
    const { result } = renderHook(() => useGameStore())
    
    act(() => {
      result.current.setCurrentMissionId('mission-1' as MissionId)
    })

    expect(result.current.currentMissionId).toBe('mission-1')
  })

  it('devrait définir le step courant', () => {
    const { result } = renderHook(() => useGameStore())
    
    act(() => {
      result.current.setCurrentStepId('mission-1-step-1' as StepId)
    })

    expect(result.current.currentStepId).toBe('mission-1-step-1')
  })

  it('devrait compléter un step', () => {
    const { result } = renderHook(() => useGameStore())
    const stepId = 'mission-1-step-1' as StepId
    
    act(() => {
      result.current.completeStep(stepId)
    })

    expect(result.current.completedSteps).toContain(stepId)
  })

  it('ne devrait pas ajouter un step déjà complété deux fois', () => {
    const { result } = renderHook(() => useGameStore())
    const stepId = 'mission-1-step-1' as StepId
    
    act(() => {
      result.current.completeStep(stepId)
      result.current.completeStep(stepId)
    })

    expect(result.current.completedSteps.filter(id => id === stepId).length).toBe(1)
  })

  it('devrait compléter une mission', () => {
    const { result } = renderHook(() => useGameStore())
    const missionId = 'mission-1' as MissionId
    
    act(() => {
      result.current.completeMission(missionId)
    })

    expect(result.current.completedMissions).toContain(missionId)
  })

  it('ne devrait pas ajouter une mission déjà complétée deux fois', () => {
    const { result } = renderHook(() => useGameStore())
    const missionId = 'mission-1' as MissionId
    
    act(() => {
      result.current.completeMission(missionId)
      result.current.completeMission(missionId)
    })

    expect(result.current.completedMissions.filter(id => id === missionId).length).toBe(1)
  })

  it('devrait réinitialiser les steps d\'une mission', () => {
    const { result } = renderHook(() => useGameStore())
    const stepIds = ['mission-1-step-1', 'mission-1-step-2'] as StepId[]
    
    act(() => {
      result.current.completeStep(stepIds[0])
      result.current.completeStep(stepIds[1])
      result.current.completeStep('mission-2-step-1' as StepId)
    })

    act(() => {
      result.current.resetMissionSteps(stepIds)
    })

    expect(result.current.completedSteps).not.toContain(stepIds[0])
    expect(result.current.completedSteps).not.toContain(stepIds[1])
    expect(result.current.completedSteps).toContain('mission-2-step-1')
  })

  it('devrait réinitialiser complètement le store', () => {
    const { result } = renderHook(() => useGameStore())
    
    act(() => {
      result.current.setCurrentMissionId('mission-1' as MissionId)
      result.current.setCurrentStepId('mission-1-step-1' as StepId)
      result.current.completeStep('mission-1-step-1' as StepId)
      result.current.completeMission('mission-1' as MissionId)
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.currentMissionId).toBeNull()
    expect(result.current.currentStepId).toBeNull()
    expect(result.current.completedSteps).toEqual([])
    expect(result.current.completedMissions).toEqual([])
    expect(result.current.isInitialized).toBe(true)
  })
})
