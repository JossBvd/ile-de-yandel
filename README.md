# L'île de Yondel - Escape Game Éducatif

Escape game éducatif interactif pour les élèves de 6ᵉ et 5ᵉ, développé avec Next.js.

## 🎯 Description

Yondel, un jeune adolescent, s'est écrasé sur une île déserte. Pour en repartir, il devra franchir 5 étapes correspondant à des lieux de l'île, afin de collecter les éléments nécessaires à la construction de son radeau.

À chaque étape, Yondel devra répondre correctement à des questions liées aux matières scolaires :

- Français
- Mathématiques
- Histoire-Géographie
- Physique-Chimie
- Sciences de la Vie et de la Terre

## 🚀 Installation

```bash
npm install
```

## 🛠️ Développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Architecture du projet

```
.
├── app/                          # Pages Next.js (App Router)
│   ├── layout.tsx               # Layout racine
│   ├── page.tsx                 # Page d'accueil
│   ├── game/                    # Zone de jeu
│      ├── layout.tsx           # Layout du jeu (HUD, inventaire)
│      ├── page.tsx             # Intro narrative
│      ├── mission/[missionId]/ # Pages des missions
│      └── step/[stepId]/       # Pages des steps
│
│
├── components/                   # Composants React
│   ├── ui/                      # Composants UI génériques
│   ├── layout/                  # Composants de layout
│   ├── game/                    # Composants métier du jeu
│   └── games/                    # Mini-jeux réutilisables
│
├── data/                        # Données du jeu
│   ├── missions/                # Définitions des missions
│   ├── steps.ts                 # Définitions des steps
│   ├── raft.ts                  # Pièces du radeau
│   └── assets.ts                # Assets (images, backgrounds)
│
├── store/                       # Stores Zustand
│   ├── gameStore.ts             # Progression globale
│   ├── inventoryStore.ts        # Pièces du radeau
│   └── hintStore.ts             # Indices utilisés
│
├── lib/                         # Utilitaires
│   ├── engine/                  # Moteurs de jeu
│   ├── storage/                 # Gestion du stockage
│   ├── orientation.ts          # Détection orientation
│   ├── navigation.ts            # Helpers de routing
│   └── constants.ts             # Constantes
│
├── hooks/                       # Hooks personnalisés
│   ├── useGameProgress.ts
│   ├── useOrientation.ts
│   ├── useHint.ts
│   └── useInventory.ts
│
└── types/                       # Types TypeScript
    ├── mission.ts
    ├── step.ts
    ├── game.ts
    └── inventory.ts
```

## 🎮 Types de mini-jeux

- **QCM** : Questions à choix multiples
- **Drag & Drop** :
  - Classement (drag-sort)
  - Sélection d'images (drag-select-image)
  - Remplir un panier (basket-fill)
  - Vider une bouteille (bottle-empty)
- **Image Click** : Cliquer sur une zone précise d'une image

## 📱 Contraintes

- **Mode paysage obligatoire** sur mobile
- Responsive (Desktop, Tablette, Mobile)
- Pas de chronomètre
- Pas de score chiffré
- Pas de pénalité

## 💾 Persistance

Les données sont stockées dans le **LocalStorage** :

- Mission en cours
- Step en cours
- Steps validés
- Indices utilisés
- Pièces du radeau obtenues

## 🛠️ Technologies

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Zustand** (state management avec persistance)
- **@dnd-kit** (drag & drop)
- **Tailwind CSS**

## 📝 Notes

- Frontend uniquement (pas de backend)
- Aucun compte utilisateur
- Aucune donnée personnelle collectée
- Conforme usage scolaire
