import { renderHook, act } from '@testing-library/react'
import { useHint } from '../useHint'
import { useHintStore } from '@/store/hintStore'
import { StepId } from '@/types/step'

describe('useHint', () => {
  beforeEach(() => {
    localStorage.clear()
    useHintStore.getState().reset()
  })

  it('devrait retourner l\'état d\'utilisation de l\'indice', () => {
    const { result } = renderHook(() => useHint('step-1' as StepId))

    expect(result.current.hintUsed).toBe(false)
  })

  it('devrait retourner true si l\'indice a été utilisé', () => {
    const { result } = renderHook(() => useHint('step-1' as StepId))

    act(() => {
      result.current.markAsUsed()
    })

    expect(result.current.hintUsed).toBe(true)
  })

  it('devrait marquer l\'indice comme utilisé', () => {
    const { result } = renderHook(() => useHint('step-1' as StepId))

    act(() => {
      result.current.markAsUsed()
    })

    expect(useHintStore.getState().hasUsedHint('step-1' as StepId)).toBe(true)
  })
})
