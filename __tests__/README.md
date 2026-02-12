# Tests - L'île de Yandel

Ce document décrit la structure des tests et comment les exécuter.

## Structure des tests

Les tests sont organisés par domaine fonctionnel :

### Stores (`store/__tests__/`)
- `gameStore.test.ts` - Tests du store de progression du jeu
- `inventoryStore.test.ts` - Tests du store d'inventaire
- `hintStore.test.ts` - Tests du store des indices
- `uiStore.test.ts` - Tests du store de l'interface utilisateur

### Engines (`lib/engine/__tests__/`)
- `stepEngine.test.ts` - Tests de validation des réponses des mini-jeux
- `missionEngine.test.ts` - Tests de la logique des missions
- `inventoryEngine.test.ts` - Tests de la logique de l'inventaire

### Composants (`components/games/__tests__/`)
- `qcm/__tests__/QCMGame.test.tsx` - Tests du composant QCM

### Hooks (`hooks/__tests__/`)
- `useGameProgress.test.ts` - Tests du hook de progression
- `useHint.test.ts` - Tests du hook d'indices
- `useInventory.test.ts` - Tests du hook d'inventaire

### Utilitaires (`lib/__tests__/` et `lib/storage/__tests__/`)
- `navigation.test.ts` - Tests des utilitaires de navigation
- `orientation.test.ts` - Tests de détection d'orientation
- `storage/localStorage.test.ts` - Tests des utilitaires de stockage

## Exécution des tests

### Tous les tests
```bash
npm test
```

### Mode watch (re-exécution automatique)
```bash
npm run test:watch
```

### Avec couverture de code
```bash
npm run test:coverage
```

### Un fichier spécifique
```bash
npm test -- store/__tests__/gameStore.test.ts
```

### Un pattern spécifique
```bash
npm test -- --testNamePattern="devrait compléter"
```

## Configuration

Les tests utilisent :
- **Jest** comme framework de test
- **React Testing Library** pour tester les composants React
- **jest-environment-jsdom** pour simuler l'environnement DOM

La configuration se trouve dans `jest.config.js` et `jest.setup.js`.

## Couverture

Les tests couvrent :
- ✅ Tous les stores Zustand (gameStore, inventoryStore, hintStore, uiStore)
- ✅ Tous les engines (stepEngine, missionEngine, inventoryEngine)
- ✅ Les composants de jeu principaux (QCM)
- ✅ Tous les hooks personnalisés
- ✅ Les utilitaires (navigation, orientation, storage)

## Bonnes pratiques

1. **Isolation** : Chaque test est indépendant et nettoie son état avant et après
2. **Nommage** : Les tests utilisent des descriptions en français claires
3. **Mocking** : Les dépendances externes sont mockées quand nécessaire
4. **Assertions** : Utilisation d'assertions explicites et descriptives
