import {
  getStepSlug,
  getStepIdFromSlug,
  getStepPath,
  getIlePath,
  getHomePath,
} from '../navigation'
import { StepId } from '@/types/step'
import { MissionId } from '@/types/mission'

describe('navigation utilities', () => {
  describe('getStepSlug', () => {
    it('devrait extraire le slug du step depuis l\'ID complet', () => {
      const result = getStepSlug('mission-1' as MissionId, 'mission-1-step-1' as StepId)
      expect(result).toBe('step-1')
    })

    it('devrait retourner l\'ID complet si le préfixe ne correspond pas', () => {
      const result = getStepSlug('mission-1' as MissionId, 'other-step-1' as StepId)
      expect(result).toBe('other-step-1')
    })
  })

  describe('getStepIdFromSlug', () => {
    it('devrait reconstituer l\'ID complet du step', () => {
      const result = getStepIdFromSlug('mission-1' as MissionId, 'step-1')
      expect(result).toBe('mission-1-step-1')
    })

    it('devrait fonctionner avec différents slugs', () => {
      const result = getStepIdFromSlug('mission-2' as MissionId, 'step-3')
      expect(result).toBe('mission-2-step-3')
    })
  })

  describe('getStepPath', () => {
    it('devrait générer le chemin vers un step', () => {
      const result = getStepPath('mission-1' as MissionId, 'mission-1-step-1' as StepId)
      expect(result).toBe('/mission-1/step-1')
    })

    it('devrait fonctionner avec différents steps', () => {
      const result = getStepPath('mission-2' as MissionId, 'mission-2-step-3' as StepId)
      expect(result).toBe('/mission-2/step-3')
    })
  })

  describe('getIlePath', () => {
    it('devrait retourner le chemin vers la carte de l\'île', () => {
      const result = getIlePath()
      expect(result).toBe('/carte-de-l-ile')
    })
  })

  describe('getHomePath', () => {
    it('devrait retourner le chemin vers la page d\'accueil', () => {
      const result = getHomePath()
      expect(result).toBe('/')
    })
  })
})
