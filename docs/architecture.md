# Architecture et découpage des composants

Documentation du projet **L’île de Yondel** (escape game web, Next.js App Router, frontend uniquement).

---

## 1. Vue d’ensemble technique

| Couche                      | Rôle                                                                                |
| --------------------------- | ----------------------------------------------------------------------------------- |
| **Next.js 16 (App Router)** | Routage par fichiers, layouts, métadonnées PWA, polices (`next/font`).              |
| **React 19**                | UI client (`"use client"` sur les écrans interactifs).                              |
| **TypeScript**              | Modèles de données (`types/`), unions discriminées pour les mini-jeux (`GameData`). |
| **Zustand + persist**       | État global (progression, inventaire, préférences) avec persistance `localStorage`. |
| **Tailwind CSS 4**          | Styles utilitaires et thème (`app/globals.css`).                                    |
| **@dnd-kit**                | Drag & drop (sensors partagés, collision `pointerWithin`).                          |

Aucune API serveur métier : la progression et l’inventaire sont **locaux au navigateur**.

---

## 2. Arborescence logique

```
app/                    # Routes et layout racine
components/
  game/                 # Coquille du jeu : step, orientation, fond, dispatch mini-jeux
  games/                # Implémentations des mini-jeux (par famille)
  ui/                   # Composants transverses (boutons, modales, accessibilité)
data/
  missions/             # Missions et steps (données TS)
  raft.ts               # Pièces de radeau et lien step ↔ pièce
hooks/                  # Logique réutilisable (progression, DnD, responsive…)
lib/
  engine/               # Règles pures (missions, steps, inventaire)
  storage/              # Abstractions localStorage / cookies
  accessibility/        # Annonces, description audio
  constants.ts          # Clés de stockage, assets UI par défaut
store/                  # Stores Zustand
types/                  # Contrats TypeScript partagés
public/                 # Assets statiques (missions, ui, backgrounds, raft…)
```

---

## 3. Routage (`app/`)

| Route                     | Rôle                                                                                                                              |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `/`                       | Accueil / pseudo joueur + **workflow intro accessibilité** (voir ci-dessous).                                                     |
| `/carte-de-l-ile`         | Carte des missions.                                                                                                               |
| `/[missionId]/[stepSlug]` | **Écran principal d’un step** (mini-jeu + barre latérale + modales). Slug dérivé de l’id du step (`mission-x-step-y` → `step-y`). |
| `/journal-de-bord`        | Journal narrative.                                                                                                                |
| `/radeau`                 | Assemblage / fusion des pièces.                                                                                                   |

La navigation canonique des steps passe par `lib/navigation.ts` (`getStepPath`, validation des slugs par rapport aux données `MISSIONS`).

### Workflow intro accessibilité + narration

Après saisie du pseudo et clic sur **JOUER**, si `readingAidStore.introWorkflowDone === false` :

1. **Écran AD** : `IntroAccessibilityChoiceModal` (acronym="AD") — _"Veux-tu activer l'audiodescription ?"_ → choix enregistré dans `audioDescriptionStore`.
2. **Écran DYS** : même composant (acronym="DYS") — _"Veux-tu activer l'aide à la lecture ?"_ → choix enregistré dans `readingAidStore`, `introWorkflowDone = true`, appel de `onNarrativeStart()`.
3. **Écran narratif** : `IntroNarrativeScreen` — 3 slides typewriter (personnage Yondel + bulle de dialogue) puis affichage de la carte de l'île → navigation vers `/carte-de-l-ile`.

Si `introWorkflowDone === true` : navigation directe vers la carte (pas d'écran narratif). **Nouvelle partie** remet `introWorkflowDone` à `false` (redéclenche le workflow complet).

#### Structure de `WelcomePage` (`app/page.tsx`)

`WelcomePage` gère l'état `showIntroNarrative` et rend **deux branches distinctes** avec des `OrientationGuard` différents :

```
showIntroNarrative === false
  └── OrientationGuard allowPortrait   ← portrait autorisé (saisie du pseudo)
        └── WelcomeContent             ← prop onNarrativeStart → setShowIntroNarrative(true)

showIntroNarrative === true
  └── OrientationGuard                 ← paysage obligatoire (overlay bloquant si portrait)
        └── IntroNarrativeScreen       ← prop onComplete → router.push("/carte-de-l-ile")
```

Ce découpage garantit que dès la validation DYS, l'overlay "mode paysage requis" s'active exactement comme sur les pages de jeu.

---

## 4. Données : missions, steps, radeau

### Missions et steps

- Chaque **mission** est un fichier `data/missions/mission-N/index.ts` qui exporte l’objet `Mission` et le tableau des `Step`.
- Les **steps** sont des fichiers `steps/step-1.ts`, etc., typés `Step` (`types/step.ts`).
- Le registre global est `data/missions/index.ts` : `MISSIONS`, `ALL_STEPS`, helpers (`getStepById`, `getMissionById`, …).

Le contenu pédagogique (textes, images sous `/missions/...`, paramètres de jeu) vit **dans les données**, pas dans les composants.

### Mini-jeux

- Le champ `step.game` est une **union discriminée** `GameData` : le discriminant est `game.type` (`GameType`).
- `components/game/GameRenderer.tsx` fait le **dispatch** vers le bon composant selon `game.type`. Le `default` utilise `assertNever` (`lib/assertNever.ts`) pour forcer l’exhaustivité TypeScript lors de l’ajout d’un nouveau type.

### Radeau

- `data/raft.ts` définit les entrées `RaftPiece` (id, libellés, image, `stepId`).
- En environnement non production, une **validation** croise `RAFT_PIECES` avec `ALL_STEPS` (`raftPiece` sur chaque step) pour éviter les divergences.
- La page `app/radeau/page.tsx` implémente l’assemblage avec `@dnd-kit` (`DndContext`, `useDraggable`, `useDroppable`, `DragOverlay`) et les hooks partagés `useDndSensors` + `useDndCollisionDetection`.
- L’inventaire affiche une grille fixe de **15 emplacements** (5 missions × 3 pièces), organisée par lignes de mission.
- Les visuels de pièces (`/raft/radeau_photo-01.webp` à `-15.webp`) sont rendus **sans déformation** (`object-contain`) pour respecter leur ratio d’origine.
- La grille d’inventaire est affichée sans espacement entre cases (`gap: 0`) et sans habillage de carte autour des pièces image pour garder un rendu “photo tel quel”.
- Les **3 slots de fusion** restent carrés (ratio 1:1), sont affichés dans un bloc de fusion compact, et acceptent les drops uniquement sur slot valide ; un clic sur un slot occupé retire la pièce.
- La progression textuelle affichée est le compteur dynamique **`x/5`** (`fusedRaftPiecesCount/MAX_FUSED_RAFT_PIECES`) ; les pastilles visuelles de progression ne sont plus rendues.
- Après chaque fusion réussie, une modal “objet fusionné” est affichée avec les visuels `public/raft/popup_merged_object-01.webp` à `-05.webp` dans l’ordre des missions.
- Quand l’audio description est activée, le bouton mégaphone de la zone de fusion est positionné à droite en absolu pour ne pas modifier la hauteur du conteneur gauche.
- Règles de fusion : les 3 pièces doivent venir de la même mission, dans l’ordre des missions ; sinon feedback d’erreur et réinitialisation des slots.

---

## 5. Moteurs métier (`lib/engine/`)

Fonctions **pures** (sans React), testables unitairement :

- **missionEngine** : mission complète, step suivant, index, pourcentage de progression.
- **stepEngine** : règles liées au déroulé d’un step (selon le besoin métier).
- **inventoryEngine** : complétude inventaire, progression, pièce associée à un `stepId`.

Les stores et les pages appellent ces fonctions plutôt que de dupliquer la logique.

---

## 6. État global (`store/`)

| Store                   | Contenu principal                                                                                                                   |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `gameStore`             | Steps complétés, mission courante, missions terminées (clé `lib/constants.ts`).                                                     |
| `inventoryStore`        | Pièces du radeau collectées.                                                                                                        |
| `hintStore`             | Indices utilisés (si applicable).                                                                                                   |
| `audioDescriptionStore` | Préférences description audio (`audioDescriptionEnabled`, `audioDescriptionFirstVisitDone`, `autoPlay`, `speed`). Expose `reset()`. |
| `readingAidStore`       | Aide à la lecture DYS (`readingAidEnabled`, `readingAidFirstVisitDone`, `introWorkflowDone`). Expose `reset()`.                     |
| `uiStore`               | État UI transverse.                                                                                                                 |

Persistance via middleware `persist` ; les noms de clés `localStorage` sont centralisés dans `lib/constants.ts`.

**Réinitialisation complète (Nouvelle partie)** : `resetProgress()` + `resetInventory()` + `resetUI()` + `resetAudioDescription()` + `resetReadingAid()` — tous les stores sont remis à zéro, ce qui redéclenche le workflow intro (AD + DYS) au prochain clic sur JOUER.

---

## 7. Découpage des composants

### 7.1 `components/game/` — coquille autour du step

| Composant                 | Responsabilité                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **`GameRenderer`**        | Seul endroit qui connaît la carte **type de jeu → composant**. Reçoit `Step` + callbacks `onComplete` / `onDefeat`. |
| **`StepBackground`**      | Fond d’écran statique avec image, contenu enfant centré (zone de jeu).                                              |
| **`ClickableBackground`** | Fond + zones cliquables (indices sur le décor) ; enrobe souvent le `GameRenderer`.                                  |
| **`OrientationGuard`**    | Contexte dimensions / orientation ; overlay paysage via `LandscapeEnforcer` sauf `allowPortrait`.                   |
| **`LandscapeEnforcer`**   | Message bloquant si portrait (contrainte produit).                                                                  |
| **`OrientationProvider`** | Variante provider si utilisée ailleurs.                                                                             |

### 7.2 `components/game/step-page/` — page `/[missionId]/[stepSlug]`

Découpage de l’**écran step** pour limiter la taille de la page :

| Composant               | Responsabilité                                                                                                        |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **`StepPageNarrative`** | Premier écran narration (mission) si `step.narrative` et premier step.                                                |
| **`StepPageSidebar`**   | Bandeau gauche : titre mission/étape, description audio, bascule instruction/inspecter, indice, radeau, retour carte. |
| **`StepPageModals`**    | Modales : défaite, objet radeau, indices (général / image), fin de mission (`MissionCompleteModal`).                  |

La page `app/[missionId]/[stepSlug]/page.tsx` orchestre : chargement du step, progression (`useGameProgress`, `useInventory`), effets (audio auto), et branchement **ClickableBackground** vs **StepBackground** selon `backgroundHintZones`.

### 7.3 `components/games/` — mini-jeux par domaine

Organisation par **famille** de mécanique :

| Dossier                  | Exemples                                                                                                         |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **`games/qcm/`**         | `QCMGame`, `QCMOption`                                                                                           |
| **`games/drag/`**        | Tri, sélection d’images, paniers, bouteille, ordre d’images, **photosynthèse** (`PhotosynthesisAtomsGame`), etc. |
| **`games/enigma/`**      | Saisie / décodage (`EnigmaGame`), cibles point-clic multi-énigmes (`PointClickMultiEnigmaGame`)                  |
| **`games/image-click/`** | Clic sur zones dans une image (`ImageClickGame`)                                                                 |

Les jeux drag utilisent en général `hooks/useDndSensors` et `hooks/useDndCollisionDetection` avec `DndContext`.

### 7.4 `components/ui/` — transverse

Boutons (`Button`, `IconButton`, `ContinueButton`), **modales** (`Modal`, `DefeatModal`, `MissionCompleteModal`, légales…), **accessibilité** (`ReadAloudButton`, `AudioDescriptionProvider`, `SkipLink`, `AudioDescriptionButton`), **PWA** (`PWAInstallPrompt`), barre de progression, etc.

Composants d'accessibilité intro :

| Composant                           | Responsabilité                                                                                                                                                                                                                                                                                                         |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`IntroAccessibilityChoiceModal`** | Modal générique Oui/Non utilisée pour les 2 écrans du workflow intro (AD puis DYS). Props : `acronym` ("AD" \| "DYS"), `question`, `onYes`, `onNo`. Fond parchemin, titre grand, boutons orange.                                                                                                                       |
| **`IntroNarrativeScreen`**          | Écran narratif affiché après le workflow AD/DYS. Fond `background_sensi_intro.webp`, Yondel ancré en bas à gauche, bulle typewriter à droite (3 slides), puis carte de l’île. Bouton `icon_next.webp` bas droite. `ReadAloudButton` sur bulle et carte ; auto-play si `audioDescriptionAutoPlay`. Prop : `onComplete`. |
| **`ReadingAidEffect`**              | Composant sans rendu (`null`) monté dans le layout. Ajoute/retire la classe `reading-aid-enabled` sur `<html>` selon `readingAidStore.readingAidEnabled`.                                                                                                                                                              |

---

## 8. Hooks et bibliothèques utiles (`hooks/`, `lib/`)

- **Progression** : `useGameProgress`, `useInventory`.
- **Responsive** : `useResponsive`, `useMediaQuery`, `useOrientation` (contexte depuis `OrientationGuard`).
- **DnD** : `useDndSensors`, `useDndCollisionDetection` (collision stable, adaptée au paysage forcé).
- **Accessibilité** : `useAudioDescription`, `useFocusTrap`, `useFullscreen`.
- **Utilitaires** : `lib/utils/logger`, stockage typé, `lib/navigation.ts`.

---

## 9. Assets publics (`public/`)

- **`/missions/mission-N/step-M/`** : images et médias **spécifiques** à un step (données qui référencent ces chemins).
- **`/ui/`** : icônes et éléments d’interface **réutilisables** (dont constantes par défaut dans `lib/constants.ts` le cas échéant).
- **`/backgrounds/`**, **`/raft/`** : fonds communs et visuels des pièces de radeau.

---

## 10. Faire évoluer le projet

### Nouvelle mission ou nouveau step

1. Ajouter les fichiers sous `data/missions/mission-X/` et enregistrer la mission dans `data/missions/index.ts`.
2. Déposer les assets sous `public/missions/...` et référencer les chemins dans le `Step`.
3. Ajouter ou aligner les entrées dans `data/raft.ts` et `raftPiece` sur le `Step` (la validation dev aidera en cas d’erreur).

### Nouveau type de mini-jeu

1. Étendre `GameType` et l’interface correspondante dans `types/step.ts` (union `GameData`).
2. Créer le composant sous `components/games/...`.
3. Ajouter un `case` dans `GameRenderer` (le `default` avec `assertNever` fera échouer la compilation tant qu’un type n’est pas géré).

---

## 11. Schéma de flux (lecture)

```
Données (MISSIONS / ALL_STEPS)
        ↓
Page step valide l’URL → charge Step
        ↓
StepPageSidebar + (ClickableBackground | StepBackground)
        ↓
GameRenderer(step.game.type) → Composant mini-jeu
        ↓
onComplete → gameStore + inventoryStore + navigation vers le step suivant ou la carte
```

Cette structure sépare **données**, **règles**, **état persistant** et **UI par type de jeu**, ce qui limite le couplage et facilite les tests unitaires sur `lib/engine/` et les stores.
