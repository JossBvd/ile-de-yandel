import {
  isMissionAccessible,
  canAccessMissionStep,
  isMissionCompleted,
  getNextStep,
  getCurrentStepIndex,
  getMissionProgress,
} from "../missionEngine";
import { MISSIONS } from "@/data/missions";
import { Mission, MissionId } from "@/types/mission";
import { StepId } from "@/types/step";

describe("missionEngine", () => {
  const [dataMission1, dataMission2] = MISSIONS;

  const mockMission: Mission = {
    id: 'mission-1',
    title: 'Mission Test',
    steps: ['step-1', 'step-2', 'step-3'] as StepId[],
  }

  describe('isMissionCompleted', () => {
    it('devrait retourner true si tous les steps sont complétés', () => {
      const completedSteps: StepId[] = ['step-1', 'step-2', 'step-3']
      const result = isMissionCompleted(mockMission, completedSteps)
      expect(result).toBe(true)
    })

    it('devrait retourner false si certains steps ne sont pas complétés', () => {
      const completedSteps: StepId[] = ['step-1', 'step-2']
      const result = isMissionCompleted(mockMission, completedSteps)
      expect(result).toBe(false)
    })

    it('devrait retourner false si aucun step n\'est complété', () => {
      const completedSteps: StepId[] = []
      const result = isMissionCompleted(mockMission, completedSteps)
      expect(result).toBe(false)
    })

    it('devrait retourner true pour une mission vide', () => {
      const emptyMission: Mission = {
        id: 'mission-empty',
        title: 'Mission Vide',
        steps: [],
      }
      const result = isMissionCompleted(emptyMission, [])
      expect(result).toBe(true)
    })
  })

  describe('getNextStep', () => {
    it('devrait retourner le premier step si aucun n\'est complété', () => {
      const completedSteps: StepId[] = []
      const result = getNextStep(mockMission, completedSteps)
      expect(result).toBe('step-1')
    })

    it('devrait retourner le step suivant si certains sont complétés', () => {
      const completedSteps: StepId[] = ['step-1']
      const result = getNextStep(mockMission, completedSteps)
      expect(result).toBe('step-2')
    })

    it('devrait retourner null si tous les steps sont complétés', () => {
      const completedSteps: StepId[] = ['step-1', 'step-2', 'step-3']
      const result = getNextStep(mockMission, completedSteps)
      expect(result).toBeNull()
    })

    it('devrait retourner null pour une mission vide', () => {
      const emptyMission: Mission = {
        id: 'mission-empty',
        title: 'Mission Vide',
        steps: [],
      }
      const result = getNextStep(emptyMission, [])
      expect(result).toBeNull()
    })

    it('devrait ignorer les steps complétés qui ne font pas partie de la mission', () => {
      const completedSteps: StepId[] = ['other-step-1', 'other-step-2']
      const result = getNextStep(mockMission, completedSteps)
      expect(result).toBe('step-1')
    })
  })

  describe('getCurrentStepIndex', () => {
    it('devrait retourner l\'index du step courant', () => {
      const result = getCurrentStepIndex(mockMission, 'step-2' as StepId)
      expect(result).toBe(1)
    })

    it('devrait retourner 0 pour le premier step', () => {
      const result = getCurrentStepIndex(mockMission, 'step-1' as StepId)
      expect(result).toBe(0)
    })

    it('devrait retourner -1 si le step n\'existe pas dans la mission', () => {
      const result = getCurrentStepIndex(mockMission, 'unknown-step' as StepId)
      expect(result).toBe(-1)
    })
  })

  describe('getMissionProgress', () => {
    it('devrait retourner 0% si aucun step n\'est complété', () => {
      const completedSteps: StepId[] = []
      const result = getMissionProgress(mockMission, completedSteps)
      expect(result).toBe(0)
    })

    it('devrait retourner 33% si un step sur trois est complété', () => {
      const completedSteps: StepId[] = ['step-1']
      const result = getMissionProgress(mockMission, completedSteps)
      expect(result).toBeCloseTo(33.33, 1)
    })

    it('devrait retourner 66% si deux steps sur trois sont complétés', () => {
      const completedSteps: StepId[] = ['step-1', 'step-2']
      const result = getMissionProgress(mockMission, completedSteps)
      expect(result).toBeCloseTo(66.67, 1)
    })

    it('devrait retourner 100% si tous les steps sont complétés', () => {
      const completedSteps: StepId[] = ['step-1', 'step-2', 'step-3']
      const result = getMissionProgress(mockMission, completedSteps)
      expect(result).toBe(100)
    })

    it('devrait retourner 0% pour une mission vide', () => {
      const emptyMission: Mission = {
        id: 'mission-empty',
        title: 'Mission Vide',
        steps: [],
      }
      const result = getMissionProgress(emptyMission, [])
      expect(result).toBe(0)
    })

    it('devrait ignorer les steps complétés qui ne font pas partie de la mission', () => {
      const completedSteps: StepId[] = ['other-step-1']
      const result = getMissionProgress(mockMission, completedSteps)
      expect(result).toBe(0)
    })
  })

  describe('isMissionAccessible', () => {
    it('devrait toujours autoriser mission-1', () => {
      expect(
        isMissionAccessible(
          'mission-1',
          [] as MissionId[],
          [],
        ),
      ).toBe(true)
    })

    it('devrait refuser mission-2 tant que mission-1 est incomplète', () => {
      expect(
        isMissionAccessible('mission-2', [], ['other' as StepId]),
      ).toBe(false)
    })

    it('devrait autoriser mission-2 quand tous les steps de mission-1 sont complétés', () => {
      const done: StepId[] = [...dataMission1.steps]
      expect(isMissionAccessible('mission-2', [], done)).toBe(true)
    })
  })

  describe('canAccessMissionStep', () => {
    it('devrait refuser un step suivant tant que les précédents ne sont pas faits', () => {
      const mission: Mission = {
        id: 'mission-1',
        title: 'M',
        steps: ['mission-1-a', 'mission-1-b', 'mission-1-c'] as StepId[],
      }
      expect(
        canAccessMissionStep(
          mission,
          'mission-1-b',
          [],
          [],
        ),
      ).toBe(false)
    })

    it('devrait autoriser uniquement le prochain step', () => {
      const mission: Mission = {
        id: 'mission-1',
        title: 'M',
        steps: ['mission-1-a', 'mission-1-b'] as StepId[],
      }
      expect(
        canAccessMissionStep(
          mission,
          'mission-1-a',
          [],
          [],
        ),
      ).toBe(true)
      expect(
        canAccessMissionStep(
          mission,
          'mission-1-b',
          [],
          ['mission-1-a'],
        ),
      ).toBe(true)
    })

    it('devrait autoriser une mission suivante après complétion de la précédente', () => {
      const done: StepId[] = [...dataMission1.steps]
      const firstM2 = dataMission2.steps[0]
      expect(canAccessMissionStep(dataMission2, firstM2, [], done)).toBe(true)
    })
  })
})
