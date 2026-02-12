import { renderHook, act } from '@testing-library/react'
import { useUIStore } from '../uiStore'
import { MissionId } from '@/types/mission'

describe('uiStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useUIStore.getState().reset()
  })

  it('devrait initialiser avec un état vide', () => {
    const { result } = renderHook(() => useUIStore())
    
    expect(result.current.viewedMissions.size).toBe(0)
    expect(result.current.raftViewed).toBe(false)
    expect(result.current.journalViewed).toBe(false)
    expect(result.current.lastViewedCompletedMission).toBeNull()
  })

  it('devrait marquer une mission comme vue', () => {
    const { result } = renderHook(() => useUIStore())
    const missionId = 'mission-1' as MissionId
    
    act(() => {
      result.current.markMissionAsViewed(missionId)
    })

    expect(result.current.viewedMissions.has(missionId)).toBe(true)
  })

  it('devrait marquer plusieurs missions comme vues', () => {
    const { result } = renderHook(() => useUIStore())
    const missionIds = ['mission-1', 'mission-2', 'mission-3'] as MissionId[]
    
    act(() => {
      missionIds.forEach(missionId => {
        result.current.markMissionAsViewed(missionId)
      })
    })

    missionIds.forEach(missionId => {
      expect(result.current.viewedMissions.has(missionId)).toBe(true)
    })
  })

  it('devrait marquer le radeau comme vu', () => {
    const { result } = renderHook(() => useUIStore())
    
    act(() => {
      result.current.markRaftAsViewed()
    })

    expect(result.current.raftViewed).toBe(true)
  })

  it('devrait marquer le journal comme vu', () => {
    const { result } = renderHook(() => useUIStore())
    
    act(() => {
      result.current.markJournalAsViewed()
    })

    expect(result.current.journalViewed).toBe(true)
  })

  it('devrait définir la dernière mission complétée vue', () => {
    const { result } = renderHook(() => useUIStore())
    const missionId = 'mission-1' as MissionId
    
    act(() => {
      result.current.setLastViewedCompletedMission(missionId)
    })

    expect(result.current.lastViewedCompletedMission).toBe(missionId)
  })

  it('devrait permettre de réinitialiser la dernière mission complétée vue', () => {
    const { result } = renderHook(() => useUIStore())
    
    act(() => {
      result.current.setLastViewedCompletedMission('mission-1' as MissionId)
      result.current.setLastViewedCompletedMission(null)
    })

    expect(result.current.lastViewedCompletedMission).toBeNull()
  })

  it('devrait réinitialiser complètement le store', () => {
    const { result } = renderHook(() => useUIStore())
    
    act(() => {
      result.current.markMissionAsViewed('mission-1' as MissionId)
      result.current.markRaftAsViewed()
      result.current.markJournalAsViewed()
      result.current.setLastViewedCompletedMission('mission-1' as MissionId)
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.viewedMissions.size).toBe(0)
    expect(result.current.raftViewed).toBe(false)
    expect(result.current.journalViewed).toBe(false)
    expect(result.current.lastViewedCompletedMission).toBeNull()
  })
})
