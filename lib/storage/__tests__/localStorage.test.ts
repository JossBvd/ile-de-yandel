import {
  getFromLocalStorage,
  setToLocalStorage,
  removeFromLocalStorage,
} from '../localStorage'

describe('localStorage utilities', () => {
  const mockLocalStorage = (() => {
    let store: Record<string, string> = {}
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString()
      },
      removeItem: (key: string) => {
        delete store[key]
      },
      clear: () => {
        store = {}
      },
    }
  })()

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })
    mockLocalStorage.clear()
    jest.clearAllMocks()
  })

  describe('setToLocalStorage', () => {
    it('devrait sauvegarder une valeur dans localStorage', () => {
      setToLocalStorage('test-key', { name: 'test' })
      expect(localStorage.getItem('test-key')).toBe('{"name":"test"}')
    })

    it('devrait sauvegarder une chaîne de caractères', () => {
      setToLocalStorage('test-key', 'test-value')
      expect(localStorage.getItem('test-key')).toBe('"test-value"')
    })

    it('devrait sauvegarder un nombre', () => {
      setToLocalStorage('test-key', 42)
      expect(localStorage.getItem('test-key')).toBe('42')
    })

    it('devrait sauvegarder un tableau', () => {
      setToLocalStorage('test-key', [1, 2, 3])
      expect(localStorage.getItem('test-key')).toBe('[1,2,3]')
    })

    it('ne devrait pas lever d\'erreur si window est undefined', () => {
      const originalWindow = global.window
      // @ts-expect-error - Simulation de l'absence de window
      global.window = undefined

      expect(() => {
        setToLocalStorage('test-key', 'value')
      }).not.toThrow()

      global.window = originalWindow
    })
  })

  describe('getFromLocalStorage', () => {
    it('devrait récupérer une valeur depuis localStorage', () => {
      localStorage.setItem('test-key', '{"name":"test"}')
      const result = getFromLocalStorage<{ name: string }>('test-key')
      expect(result).toEqual({ name: 'test' })
    })

    it('devrait retourner null si la clé n\'existe pas', () => {
      const result = getFromLocalStorage('non-existent-key')
      expect(result).toBeNull()
    })

    it('devrait retourner null si window est undefined', () => {
      const originalWindow = global.window
      // @ts-expect-error - Simulation de l'absence de window
      global.window = undefined

      const result = getFromLocalStorage('test-key')
      expect(result).toBeNull()

      global.window = originalWindow
    })

    it('devrait gérer les erreurs de parsing JSON', () => {
      mockLocalStorage.setItem('test-key', 'invalid-json')
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      const result = getFromLocalStorage('test-key')
      
      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })
  })

  describe('removeFromLocalStorage', () => {
    it('devrait supprimer une clé de localStorage', () => {
      localStorage.setItem('test-key', 'value')
      removeFromLocalStorage('test-key')
      expect(localStorage.getItem('test-key')).toBeNull()
    })

    it('ne devrait pas lever d\'erreur si la clé n\'existe pas', () => {
      expect(() => {
        removeFromLocalStorage('non-existent-key')
      }).not.toThrow()
    })

    it('ne devrait pas lever d\'erreur si window est undefined', () => {
      const originalWindow = global.window
      // @ts-expect-error - Simulation de l'absence de window
      global.window = undefined

      expect(() => {
        removeFromLocalStorage('test-key')
      }).not.toThrow()

      global.window = originalWindow
    })
  })
})
