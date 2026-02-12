import { validateStepAnswer } from '../stepEngine'
import { Step, QCMGameData, DragSortGameData, DragSelectImageGameData, BasketFillGameData, BottleEmptyGameData, ImageClickGameData } from '@/types/step'

describe('stepEngine', () => {
  describe('validateStepAnswer', () => {
    describe('QCM', () => {
      it('devrait valider une réponse QCM correcte (une seule réponse)', () => {
        const step: Step = {
          id: 'test-step',
          title: 'Test',
          instruction: 'Test',
          game: {
            type: 'qcm',
            question: 'Quelle est la capitale de la France ?',
            options: [
              { id: 'A', text: 'Paris' },
              { id: 'B', text: 'Lyon' },
              { id: 'C', text: 'Marseille' },
              { id: 'D', text: 'Toulouse' },
            ],
            correctAnswers: [0],
          } as QCMGameData,
        }

        const result = validateStepAnswer(step, 0)

        expect(result.isValid).toBe(true)
        expect(result.message).toContain('Bravo')
      })

      it('devrait rejeter une réponse QCM incorrecte', () => {
        const step: Step = {
          id: 'test-step',
          title: 'Test',
          instruction: 'Test',
          game: {
            type: 'qcm',
            question: 'Quelle est la capitale de la France ?',
            options: [
              { id: 'A', text: 'Paris' },
              { id: 'B', text: 'Lyon' },
            ],
            correctAnswers: [0],
          } as QCMGameData,
        }

        const result = validateStepAnswer(step, 1)

        expect(result.isValid).toBe(false)
        expect(result.message).toContain('Mauvaise réponse')
      })

      it('devrait valider plusieurs réponses QCM correctes', () => {
        const step: Step = {
          id: 'test-step',
          title: 'Test',
          instruction: 'Test',
          game: {
            type: 'qcm',
            question: 'Quelles sont les capitales ?',
            options: [
              { id: 'A', text: 'Paris' },
              { id: 'B', text: 'Londres' },
              { id: 'C', text: 'Berlin' },
              { id: 'D', text: 'Madrid' },
            ],
            correctAnswers: [0, 1],
          } as QCMGameData,
        }

        const result = validateStepAnswer(step, [0, 1])

        expect(result.isValid).toBe(true)
        expect(result.message).toContain('Toutes les réponses sont correctes')
      })

      it('devrait rejeter si le nombre de réponses ne correspond pas', () => {
        const step: Step = {
          id: 'test-step',
          title: 'Test',
          instruction: 'Test',
          game: {
            type: 'qcm',
            question: 'Quelles sont les capitales ?',
            options: [
              { id: 'A', text: 'Paris' },
              { id: 'B', text: 'Londres' },
            ],
            correctAnswers: [0, 1],
          } as QCMGameData,
        }

        const result = validateStepAnswer(step, [0])

        expect(result.isValid).toBe(false)
        expect(result.message).toContain('Vous devez sélectionner')
      })
    })

    describe('Drag Sort', () => {
      it('devrait valider un ordre correct', () => {
        const step: Step = {
          id: 'test-step',
          title: 'Test',
          instruction: 'Test',
          game: {
            type: 'drag-sort',
            items: [
              { id: '1', content: 'Premier' },
              { id: '2', content: 'Deuxième' },
              { id: '3', content: 'Troisième' },
            ],
            correctOrder: ['1', '2', '3'],
          } as DragSortGameData,
        }

        const result = validateStepAnswer(step, ['1', '2', '3'])

        expect(result.isValid).toBe(true)
        expect(result.message).toContain('Bravo')
      })

      it('devrait rejeter un ordre incorrect', () => {
        const step: Step = {
          id: 'test-step',
          title: 'Test',
          instruction: 'Test',
          game: {
            type: 'drag-sort',
            items: [
              { id: '1', content: 'Premier' },
              { id: '2', content: 'Deuxième' },
            ],
            correctOrder: ['1', '2'],
          } as DragSortGameData,
        }

        const result = validateStepAnswer(step, ['2', '1'])

        expect(result.isValid).toBe(false)
        expect(result.message).toContain('L\'ordre n\'est pas bon')
      })

      it('devrait rejeter si l\'ordre est incomplet', () => {
        const step: Step = {
          id: 'test-step',
          title: 'Test',
          instruction: 'Test',
          game: {
            type: 'drag-sort',
            items: [
              { id: '1', content: 'Premier' },
              { id: '2', content: 'Deuxième' },
            ],
            correctOrder: ['1', '2'],
          } as DragSortGameData,
        }

        const result = validateStepAnswer(step, ['1'])

        expect(result.isValid).toBe(false)
        expect(result.message).toContain('L\'ordre n\'est pas complet')
      })
    })

    describe('Drag Select Image', () => {
      it('devrait valider une sélection correcte', () => {
        const step: Step = {
          id: 'test-step',
          title: 'Test',
          instruction: 'Test',
          game: {
            type: 'drag-select-image',
            images: [
              { id: 'img1', src: '/img1.jpg', alt: 'Image 1' },
              { id: 'img2', src: '/img2.jpg', alt: 'Image 2' },
            ],
            correctImages: ['img1', 'img2'],
          } as DragSelectImageGameData,
        }

        const result = validateStepAnswer(step, ['img1', 'img2'])

        expect(result.isValid).toBe(true)
        expect(result.message).toContain('Bravo')
      })

      it('devrait rejeter une sélection incorrecte', () => {
        const step: Step = {
          id: 'test-step',
          title: 'Test',
          instruction: 'Test',
          game: {
            type: 'drag-select-image',
            images: [
              { id: 'img1', src: '/img1.jpg', alt: 'Image 1' },
              { id: 'img2', src: '/img2.jpg', alt: 'Image 2' },
            ],
            correctImages: ['img1'],
          } as DragSelectImageGameData,
        }

        const result = validateStepAnswer(step, ['img2'])

        expect(result.isValid).toBe(false)
        expect(result.message).toContain('Certaines images sont incorrectes')
      })
    })

    describe('Basket Fill', () => {
      it('devrait valider un panier correct', () => {
        const step: Step = {
          id: 'test-step',
          title: 'Test',
          instruction: 'Test',
          game: {
            type: 'basket-fill',
            items: [
              { id: 'item1', label: 'Item 1' },
              { id: 'item2', label: 'Item 2' },
            ],
            correctItems: ['item1', 'item2'],
          } as BasketFillGameData,
        }

        const result = validateStepAnswer(step, ['item1', 'item2'])

        expect(result.isValid).toBe(true)
        expect(result.message).toContain('Bravo')
      })

      it('devrait rejeter un panier incorrect', () => {
        const step: Step = {
          id: 'test-step',
          title: 'Test',
          instruction: 'Test',
          game: {
            type: 'basket-fill',
            items: [
              { id: 'item1', label: 'Item 1' },
              { id: 'item2', label: 'Item 2' },
            ],
            correctItems: ['item1'],
          } as BasketFillGameData,
        }

        const result = validateStepAnswer(step, ['item2'])

        expect(result.isValid).toBe(false)
        expect(result.message).toContain('Certains items sont incorrects')
      })
    })

    describe('Bottle Empty', () => {
      it('devrait valider un ordre de vidage correct', () => {
        const step: Step = {
          id: 'test-step',
          title: 'Test',
          instruction: 'Test',
          game: {
            type: 'bottle-empty',
            items: [
              { id: '1', content: 'Premier' },
              { id: '2', content: 'Deuxième' },
            ],
            correctOrder: ['1', '2'],
          } as BottleEmptyGameData,
        }

        const result = validateStepAnswer(step, ['1', '2'])

        expect(result.isValid).toBe(true)
        expect(result.message).toContain('Bravo')
      })

      it('devrait rejeter un ordre de vidage incorrect', () => {
        const step: Step = {
          id: 'test-step',
          title: 'Test',
          instruction: 'Test',
          game: {
            type: 'bottle-empty',
            items: [
              { id: '1', content: 'Premier' },
              { id: '2', content: 'Deuxième' },
            ],
            correctOrder: ['1', '2'],
          } as BottleEmptyGameData,
        }

        const result = validateStepAnswer(step, ['2', '1'])

        expect(result.isValid).toBe(false)
        expect(result.message).toContain('L\'ordre de vidage n\'est pas bon')
      })
    })

    describe('Image Click', () => {
      it('devrait valider des clics corrects dans des zones circulaires', () => {
        const step: Step = {
          id: 'test-step',
          title: 'Test',
          instruction: 'Test',
          game: {
            type: 'image-click',
            image: '/test.jpg',
            clickableZones: [
              { type: 'circle', x: 50, y: 50, radius: 10 },
              { type: 'circle', x: 80, y: 80, radius: 10 },
            ],
          } as ImageClickGameData,
        }

        const result = validateStepAnswer(step, [
          { x: 50, y: 50 },
          { x: 80, y: 80 },
        ])

        expect(result.isValid).toBe(true)
        expect(result.message).toContain('Bravo')
      })

      it('devrait valider des clics corrects dans des zones rectangulaires', () => {
        const step: Step = {
          id: 'test-step',
          title: 'Test',
          instruction: 'Test',
          game: {
            type: 'image-click',
            image: '/test.jpg',
            clickableZones: [
              { type: 'rectangle', x: 10, y: 10, width: 20, height: 20 },
            ],
          } as ImageClickGameData,
        }

        const result = validateStepAnswer(step, [{ x: 15, y: 15 }])

        expect(result.isValid).toBe(true)
      })

      it('devrait rejeter des clics en dehors des zones', () => {
        const step: Step = {
          id: 'test-step',
          title: 'Test',
          instruction: 'Test',
          game: {
            type: 'image-click',
            image: '/test.jpg',
            clickableZones: [
              { type: 'circle', x: 50, y: 50, radius: 10 },
            ],
          } as ImageClickGameData,
        }

        const result = validateStepAnswer(step, [{ x: 100, y: 100 }])

        expect(result.isValid).toBe(false)
        expect(result.message).toContain('Certains objets ne sont pas corrects')
      })

      it('devrait rejeter si le nombre de clics ne correspond pas', () => {
        const step: Step = {
          id: 'test-step',
          title: 'Test',
          instruction: 'Test',
          game: {
            type: 'image-click',
            image: '/test.jpg',
            clickableZones: [
              { type: 'circle', x: 50, y: 50, radius: 10 },
              { type: 'circle', x: 80, y: 80, radius: 10 },
            ],
          } as ImageClickGameData,
        }

        const result = validateStepAnswer(step, [{ x: 50, y: 50 }])

        expect(result.isValid).toBe(false)
        expect(result.message).toContain('Vous devez trouver')
      })
    })

    it('devrait retourner une erreur pour un type de jeu non reconnu', () => {
      const step = {
        id: 'test-step',
        title: 'Test',
        instruction: 'Test',
        game: { type: 'unknown' },
      } as unknown as Step

      const result = validateStepAnswer(step, null)

      expect(result.isValid).toBe(false)
      expect(result.message).toContain('non reconnu')
    })
  })
})
