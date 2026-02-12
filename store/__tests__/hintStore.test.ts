import { renderHook, act } from '@testing-library/react'
import { useHintStore } from '../hintStore'
import { StepId } from '@/types/step'

describe('hintStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useHintStore.getState().reset()
  })

  it('devrait initialiser avec aucun indice utilisé', () => {
    const { result } = renderHook(() => useHintStore())
    
    expect(result.current.usedHints).toEqual([])
  })

  it('devrait vérifier si un indice a été utilisé', () => {
    const { result } = renderHook(() => useHintStore())
    const stepId = 'mission-1-step-1' as StepId
    
    expect(result.current.hasUsedHint(stepId)).toBe(false)
    
    act(() => {
      result.current.markHintAsUsed(stepId)
    })

    expect(result.current.hasUsedHint(stepId)).toBe(true)
  })

  it('devrait marquer un indice comme utilisé', () => {
    const { result } = renderHook(() => useHintStore())
    const stepId = 'mission-1-step-1' as StepId
    
    act(() => {
      result.current.markHintAsUsed(stepId)
    })

    expect(result.current.usedHints).toContain(stepId)
  })

  it('ne devrait pas ajouter un indice déjà utilisé deux fois', () => {
    const { result } = renderHook(() => useHintStore())
    const stepId = 'mission-1-step-1' as StepId
    
    act(() => {
      result.current.markHintAsUsed(stepId)
      result.current.markHintAsUsed(stepId)
    })

    expect(result.current.usedHints.filter(id => id === stepId).length).toBe(1)
  })

  it('devrait gérer plusieurs indices utilisés', () => {
    const { result } = renderHook(() => useHintStore())
    const stepIds = ['mission-1-step-1', 'mission-1-step-2', 'mission-2-step-1'] as StepId[]
    
    act(() => {
      stepIds.forEach(stepId => {
        result.current.markHintAsUsed(stepId)
      })
    })

    stepIds.forEach(stepId => {
      expect(result.current.hasUsedHint(stepId)).toBe(true)
    })
  })

  it('devrait réinitialiser les indices utilisés', () => {
    const { result } = renderHook(() => useHintStore())
    
    act(() => {
      result.current.markHintAsUsed('mission-1-step-1' as StepId)
      result.current.markHintAsUsed('mission-1-step-2' as StepId)
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.usedHints).toEqual([])
  })
})
