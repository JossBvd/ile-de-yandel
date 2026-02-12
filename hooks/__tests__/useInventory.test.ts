import { renderHook, act } from '@testing-library/react'
import { useInventory } from '../useInventory'
import { useInventoryStore } from '@/store/inventoryStore'
import { RaftPieceId } from '@/types/step'
import { TOTAL_RAFT_PIECES } from '@/data/raft'

describe('useInventory', () => {
  beforeEach(() => {
    localStorage.clear()
    useInventoryStore.getState().reset()
  })

  it('devrait retourner les pièces collectées', () => {
    const { result } = renderHook(() => useInventory())

    expect(result.current.collectedPieces).toEqual([])
  })

  it('devrait retourner le nombre total de pièces', () => {
    const { result } = renderHook(() => useInventory())

    expect(result.current.totalPieces).toBe(TOTAL_RAFT_PIECES)
  })

  it('devrait retourner la progression', () => {
    const { result } = renderHook(() => useInventory())

    expect(result.current.progress).toBe(0)
  })

  it('devrait vérifier si le radeau est complet', () => {
    const { result } = renderHook(() => useInventory())

    expect(result.current.raftComplete).toBe(false)
  })

  it('devrait permettre d\'ajouter une pièce', () => {
    const { result } = renderHook(() => useInventory())

    act(() => {
      result.current.addPiece('piece-1-1' as RaftPieceId)
    })

    expect(result.current.collectedPieces).toContain('piece-1-1')
  })

  it('devrait vérifier si une pièce est collectée', () => {
    const { result } = renderHook(() => useInventory())

    act(() => {
      result.current.addPiece('piece-1-1' as RaftPieceId)
    })

    expect(result.current.hasPiece('piece-1-1' as RaftPieceId)).toBe(true)
    expect(result.current.hasPiece('piece-1-2' as RaftPieceId)).toBe(false)
  })

  it('devrait permettre de réinitialiser l\'inventaire', () => {
    const { result } = renderHook(() => useInventory())

    act(() => {
      result.current.addPiece('piece-1-1' as RaftPieceId)
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.collectedPieces).toEqual([])
  })
})
