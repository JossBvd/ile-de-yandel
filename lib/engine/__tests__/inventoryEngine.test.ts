import {
  getRaftPieceForStep,
  isInventoryComplete,
  getInventoryProgress,
  getMissingPiecesCount,
} from '../inventoryEngine'
import { RaftPieceId } from '@/types/step'
import { TOTAL_RAFT_PIECES } from '@/data/raft'

describe('inventoryEngine', () => {
  describe('getRaftPieceForStep', () => {
    it('devrait retourner la pièce associée à un step existant', () => {
      const result = getRaftPieceForStep('mission-1-step-1')
      expect(result).toBe('piece-1-1')
    })

    it('devrait retourner null pour un step inexistant', () => {
      const result = getRaftPieceForStep('unknown-step')
      expect(result).toBeNull()
    })
  })

  describe('isInventoryComplete', () => {
    it('devrait retourner true si toutes les pièces sont collectées', () => {
      const collectedPieces: RaftPieceId[] = []
      for (let i = 0; i < TOTAL_RAFT_PIECES; i++) {
        collectedPieces.push(`piece-${i}` as RaftPieceId)
      }
      const result = isInventoryComplete(collectedPieces)
      expect(result).toBe(true)
    })

    it('devrait retourner false si des pièces manquent', () => {
      const collectedPieces: RaftPieceId[] = ['piece-1-1' as RaftPieceId]
      const result = isInventoryComplete(collectedPieces)
      expect(result).toBe(false)
    })

    it('devrait retourner true si plus de pièces que nécessaire sont collectées', () => {
      const collectedPieces: RaftPieceId[] = []
      for (let i = 0; i < TOTAL_RAFT_PIECES + 5; i++) {
        collectedPieces.push(`piece-${i}` as RaftPieceId)
      }
      const result = isInventoryComplete(collectedPieces)
      expect(result).toBe(true)
    })
  })

  describe('getInventoryProgress', () => {
    it('devrait retourner 0% si aucune pièce n\'est collectée', () => {
      const collectedPieces: RaftPieceId[] = []
      const result = getInventoryProgress(collectedPieces)
      expect(result).toBe(0)
    })

    it('devrait retourner environ 50% si la moitié des pièces sont collectées', () => {
      const collectedPieces: RaftPieceId[] = []
      const halfCount = Math.floor(TOTAL_RAFT_PIECES / 2)
      for (let i = 0; i < halfCount; i++) {
        collectedPieces.push(`piece-${i}` as RaftPieceId)
      }
      const result = getInventoryProgress(collectedPieces)
      const expectedProgress = Math.round((halfCount / TOTAL_RAFT_PIECES) * 100)
      expect(result).toBe(expectedProgress)
    })

    it('devrait retourner 100% si toutes les pièces sont collectées', () => {
      const collectedPieces: RaftPieceId[] = []
      for (let i = 0; i < TOTAL_RAFT_PIECES; i++) {
        collectedPieces.push(`piece-${i}` as RaftPieceId)
      }
      const result = getInventoryProgress(collectedPieces)
      expect(result).toBe(100)
    })

    it('devrait arrondir le pourcentage', () => {
      const collectedPieces: RaftPieceId[] = []
      const oneThird = Math.floor(TOTAL_RAFT_PIECES / 3)
      for (let i = 0; i < oneThird; i++) {
        collectedPieces.push(`piece-${i}` as RaftPieceId)
      }
      const result = getInventoryProgress(collectedPieces)
      expect(Number.isInteger(result)).toBe(true)
    })
  })

  describe('getMissingPiecesCount', () => {
    it('devrait retourner le nombre total de pièces si aucune n\'est collectée', () => {
      const collectedPieces: RaftPieceId[] = []
      const result = getMissingPiecesCount(collectedPieces)
      expect(result).toBe(TOTAL_RAFT_PIECES)
    })

    it('devrait retourner 0 si toutes les pièces sont collectées', () => {
      const collectedPieces: RaftPieceId[] = []
      for (let i = 0; i < TOTAL_RAFT_PIECES; i++) {
        collectedPieces.push(`piece-${i}` as RaftPieceId)
      }
      const result = getMissingPiecesCount(collectedPieces)
      expect(result).toBe(0)
    })

    it('devrait retourner le nombre correct de pièces manquantes', () => {
      const collectedPieces: RaftPieceId[] = ['piece-1-1' as RaftPieceId, 'piece-1-2' as RaftPieceId]
      const result = getMissingPiecesCount(collectedPieces)
      expect(result).toBe(TOTAL_RAFT_PIECES - 2)
    })

    it('ne devrait jamais retourner un nombre négatif', () => {
      const collectedPieces: RaftPieceId[] = []
      for (let i = 0; i < TOTAL_RAFT_PIECES + 10; i++) {
        collectedPieces.push(`piece-${i}` as RaftPieceId)
      }
      const result = getMissingPiecesCount(collectedPieces)
      expect(result).toBeGreaterThanOrEqual(0)
    })
  })
})
