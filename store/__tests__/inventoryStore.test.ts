import { renderHook, act } from '@testing-library/react'
import { useInventoryStore } from '../inventoryStore'
import { RaftPieceId } from '@/types/step'
import { TOTAL_RAFT_PIECES, MAX_FUSED_RAFT_PIECES } from '@/data/raft'

describe('inventoryStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useInventoryStore.getState().reset()
  })

  it('devrait initialiser avec un inventaire vide', () => {
    const { result } = renderHook(() => useInventoryStore())
    
    expect(result.current.collectedPieces).toEqual([])
    expect(result.current.fusedRaftPiecesCount).toBe(0)
    expect(result.current.fusedPieces).toEqual([])
  })

  it('devrait ajouter une pièce à l\'inventaire', () => {
    const { result } = renderHook(() => useInventoryStore())
    const pieceId = 'piece-1-1' as RaftPieceId
    
    act(() => {
      result.current.addPiece(pieceId)
    })

    expect(result.current.collectedPieces).toContain(pieceId)
  })

  it('ne devrait pas ajouter une pièce déjà collectée', () => {
    const { result } = renderHook(() => useInventoryStore())
    const pieceId = 'piece-1-1' as RaftPieceId
    
    act(() => {
      result.current.addPiece(pieceId)
      result.current.addPiece(pieceId)
    })

    expect(result.current.collectedPieces.filter(id => id === pieceId).length).toBe(1)
  })

  it('devrait vérifier si une pièce est collectée', () => {
    const { result } = renderHook(() => useInventoryStore())
    const pieceId = 'piece-1-1' as RaftPieceId
    
    act(() => {
      result.current.addPiece(pieceId)
    })

    expect(result.current.hasPiece(pieceId)).toBe(true)
    expect(result.current.hasPiece('piece-1-2' as RaftPieceId)).toBe(false)
  })

  it('devrait fusionner 3 pièces', () => {
    const { result } = renderHook(() => useInventoryStore())
    const pieceIds = ['piece-1-1', 'piece-1-2', 'piece-1-3'] as [RaftPieceId, RaftPieceId, RaftPieceId]
    
    act(() => {
      result.current.addPiece(pieceIds[0])
      result.current.addPiece(pieceIds[1])
      result.current.addPiece(pieceIds[2])
    })

    let fusionResult = false
    act(() => {
      fusionResult = result.current.consumePiecesForFusion(pieceIds)
    })

    expect(fusionResult).toBe(true)
    expect(result.current.collectedPieces.length).toBe(0)
    expect(result.current.fusedRaftPiecesCount).toBe(1)
    expect(result.current.fusedPieces).toContain('fused-1')
  })

  it('ne devrait pas fusionner si toutes les pièces ne sont pas présentes', () => {
    const { result } = renderHook(() => useInventoryStore())
    const pieceIds = ['piece-1-1', 'piece-1-2', 'piece-1-3'] as [RaftPieceId, RaftPieceId, RaftPieceId]
    
    act(() => {
      result.current.addPiece(pieceIds[0])
      result.current.addPiece(pieceIds[1])
    })

    let fusionResult = false
    act(() => {
      fusionResult = result.current.consumePiecesForFusion(pieceIds)
    })

    expect(fusionResult).toBe(false)
    expect(result.current.collectedPieces.length).toBe(2)
    expect(result.current.fusedRaftPiecesCount).toBe(0)
  })

  it('ne devrait pas fusionner au-delà du maximum', () => {
    const { result } = renderHook(() => useInventoryStore())
    
    for (let i = 0; i < MAX_FUSED_RAFT_PIECES; i++) {
      act(() => {
        result.current.addPiece(`piece-${i}-1` as RaftPieceId)
        result.current.addPiece(`piece-${i}-2` as RaftPieceId)
        result.current.addPiece(`piece-${i}-3` as RaftPieceId)
        result.current.consumePiecesForFusion([
          `piece-${i}-1`,
          `piece-${i}-2`,
          `piece-${i}-3`
        ] as [RaftPieceId, RaftPieceId, RaftPieceId])
      })
    }

    act(() => {
      result.current.addPiece('piece-extra-1' as RaftPieceId)
      result.current.addPiece('piece-extra-2' as RaftPieceId)
      result.current.addPiece('piece-extra-3' as RaftPieceId)
    })

    let fusionResult = false
    act(() => {
      fusionResult = result.current.consumePiecesForFusion([
        'piece-extra-1',
        'piece-extra-2',
        'piece-extra-3'
      ] as [RaftPieceId, RaftPieceId, RaftPieceId])
    })

    expect(fusionResult).toBe(false)
    expect(result.current.fusedRaftPiecesCount).toBe(MAX_FUSED_RAFT_PIECES)
  })

  it('devrait calculer la progression', () => {
    const { result } = renderHook(() => useInventoryStore())
    
    act(() => {
      result.current.addPiece('piece-1-1' as RaftPieceId)
    })

    const progress = result.current.getProgress()
    expect(progress).toBeGreaterThanOrEqual(0)
    expect(progress).toBeLessThanOrEqual(100)
  })

  it('devrait vérifier si le radeau est complet', () => {
    const { result } = renderHook(() => useInventoryStore())
    
    for (let i = 0; i < TOTAL_RAFT_PIECES; i++) {
      act(() => {
        result.current.addPiece(`piece-${i}` as RaftPieceId)
      })
    }

    expect(result.current.isRaftComplete()).toBe(true)
  })

  it('devrait réinitialiser l\'inventaire', () => {
    const { result } = renderHook(() => useInventoryStore())
    
    act(() => {
      result.current.addPiece('piece-1-1' as RaftPieceId)
      result.current.consumePiecesForFusion([
        'piece-1-1',
        'piece-1-2',
        'piece-1-3'
      ] as [RaftPieceId, RaftPieceId, RaftPieceId])
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.collectedPieces).toEqual([])
    expect(result.current.fusedRaftPiecesCount).toBe(0)
    expect(result.current.fusedPieces).toEqual([])
  })
})
