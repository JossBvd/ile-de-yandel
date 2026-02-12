import { isLandscape, useOrientationListener } from '../orientation'

describe('orientation utilities', () => {
  describe('isLandscape', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 768,
      })
    })

    it('devrait retourner true si la largeur est supérieure à la hauteur', () => {
      window.innerWidth = 1024
      window.innerHeight = 768
      expect(isLandscape()).toBe(true)
    })

    it('devrait retourner false si la hauteur est supérieure à la largeur', () => {
      window.innerWidth = 768
      window.innerHeight = 1024
      expect(isLandscape()).toBe(false)
    })

    it('devrait retourner true par défaut si window est undefined', () => {
      const originalWindow = global.window
      // @ts-expect-error - Simulation de l'absence de window
      global.window = undefined

      expect(isLandscape()).toBe(true)

      global.window = originalWindow
    })
  })

  describe('useOrientationListener', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 768,
      })
    })

    it('devrait appeler le callback avec l\'état initial', () => {
      const callback = jest.fn()
      useOrientationListener(callback)

      expect(callback).toHaveBeenCalledWith(true)
    })

    it('devrait écouter les événements resize', () => {
      const callback = jest.fn()
      const removeListener = useOrientationListener(callback)

      callback.mockClear()

      window.innerWidth = 768
      window.innerHeight = 1024
      window.dispatchEvent(new Event('resize'))

      expect(callback).toHaveBeenCalledWith(false)

      removeListener()
    })

    it('devrait écouter les événements orientationchange', () => {
      const callback = jest.fn()
      const removeListener = useOrientationListener(callback)

      callback.mockClear()

      window.innerWidth = 768
      window.innerHeight = 1024
      window.dispatchEvent(new Event('orientationchange'))

      expect(callback).toHaveBeenCalled()

      removeListener()
    })

    it('devrait retourner une fonction pour supprimer les listeners', () => {
      const callback = jest.fn()
      const removeListener = useOrientationListener(callback)

      expect(typeof removeListener).toBe('function')

      removeListener()
      callback.mockClear()

      window.dispatchEvent(new Event('resize'))
      expect(callback).not.toHaveBeenCalled()
    })

    it('ne devrait pas lever d\'erreur si window est undefined', () => {
      const originalWindow = global.window
      // @ts-expect-error - Simulation de l'absence de window
      delete global.window

      const callback = jest.fn()
      const removeListener = useOrientationListener(callback)

      expect(typeof removeListener).toBe('function')

      removeListener()

      global.window = originalWindow
    })
  })
})
