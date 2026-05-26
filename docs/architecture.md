# Architecture et découpage des composants

Documentation du projet **Le crash de Yandel** (escape game web, Next.js App Router, frontend uniquement).

---

## 1. Vue d’ensemble technique

| Couche                      | Rôle                                                                                |
| --------------------------- | ----------------------------------------------------------------------------------- |
| **Next.js 16 (App Router)** | Routage par fichiers, layouts, métadonnées PWA, polices (`next/font`).              |
| **React 19**                | UI client (`"use client"` sur les écrans interactifs).                              |
| **TypeScript**              | Modèles de données (`types/`), unions discriminées pour les mini-jeux (`GameData`). |
| **Zustand + persist**       | État global (progression, inventaire, préférences) avec persistance `sessionStorage` (toute la progression et les préférences ; réinitialisés à la fermeture du navigateur). |
| **Tailwind CSS 4**          | Styles utilitaires et thème (`app/globals.css`).                                    |
| **@dnd-kit**                | Drag & drop (sensors partagés, collision `pointerWithin`).                          |

Aucune API serveur métier : la progression et l’inventaire sont **locaux au navigateur** (session en cours uniquement).

---

## 2. Arborescence logique

```
app/                    # Routes et layout racine
components/
  game/                 # Coquille du jeu : step, orientation, fond, dispatch mini-jeux
  games/                # Implémentations des mini-jeux (par famille)
  ui/                   # Composants transverses (boutons, modales, accessibilité)
  ui/narrative/         # Layout bulle BD, typewriter, typo et découpage slides narratifs
data/
  missions/             # Missions et steps (données TS)
  raft.ts               # Pièces de radeau et lien step ↔ pièce
hooks/                  # Logique réutilisable (progression, DnD, responsive, hydratation persist `gameStore`…)
lib/
  engine/               # Règles pures (missions, steps, inventaire)
  storage/              # Abstractions sessionStorage / cookies
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

### Accès direct par URL (saisie manuelle dans la barre d’adresse)

La validation du **slug seul** ne suffit pas : il faut aussi respecter la **progression persistée** (`gameStore`). Sinon un joueur pourrait ouvrir une mission ou un step non débloqués en tapant `/{missionId}/{stepSlug}`.

- **Mission** : règle alignée sur la carte (`app/carte-de-l-ile/page.tsx`) via `lib/engine/missionEngine.ts` → **`isMissionAccessible`** (mission 1 toujours ; mission _N_ si la mission précédente est entièrement complétée dans `completedSteps`, ou bien si l’identifiant de la mission précédente figure dans `completedMissions`).
- **Step dans une mission** : **`canAccessMissionStep`** — autorisés le **premier step non complété** (`getNextStep`), tout step **déjà dans `completedSteps`** (rejouabilité depuis l’URL), et tout step d’une mission **dont tous les steps sont complétés** (mission terminée mais pas encore relancée depuis la carte comme un « reset » uniquement carte).
- **Page** `app/[missionId]/[stepSlug]/page.tsx` : après **réhydratation** du persist Zustand (`hooks/useGameStoreHydrated.ts`), si l’accès est refusé → `router.replace("/carte-de-l-ile")` et aucun rendu du mini-jeu. Tant que le store n’est pas réhydraté depuis `sessionStorage`, la page ne rend pas le contenu (évite un renvoi erroné avec `completedSteps` vide au premier frame).
- **Limite** : sans API serveur, la contrainte est **côté client uniquement** ; une modification manuelle du `sessionStorage` ou des outils dev peut contourner cette logique. C’est cohérent avec un escape game scolaire sans backend métier.

### Workflow intro accessibilité + narration

Après saisie du pseudo et clic sur **JOUER**, si `readingAidStore.introWorkflowDone === false` :

1. **Écran AD** : `IntroAccessibilityChoiceModal` (acronym="AD") — _"Veux-tu activer l'audiodescription ?"_ → choix enregistré dans `audioDescriptionStore`.
2. **Écran DYS** : même composant (acronym="DYS") — _"Veux-tu activer l'aide à la lecture ?"_ → choix enregistré dans `readingAidStore`, `introWorkflowDone = true`, appel de `onNarrativeStart()`.
3. **Écran narratif** : `IntroNarrativeScreen` — 3 slides typewriter (`NarrativeDialogueLayout`, titre hors bulle) : présentation de Yandel, crash sur l’île, consigne de jeu ; puis carte de l’île → `/carte-de-l-ile`. Textes dans `components/ui/IntroNarrativeScreen.tsx` (`INTRO_SLIDES`).

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
- L’inventaire affiche une grille fixe de **15 emplacements** (5 missions × 3 pièces), organisée par lignes de mission (une ligne = une mission ; les lignes restent fixes même après fusion).
- Les visuels de pièces (`/raft/radeau_photo-01.webp` à `-15.webp`) sont rendus **sans déformation** (`object-contain`) pour respecter leur ratio d’origine.
- La grille d’inventaire est affichée sans espacement entre cases (`gap: 0`) et sans habillage de carte autour des pièces image pour garder un rendu « photo tel quel ».
- Une fusion réussie affiche un **objet fusionné dans l’inventaire** avec les visuels `public/raft/merged_photo-01.webp` à `-05.webp` (ordre par mission).
- L’ordre de fusion est **libre** (toute mission peut être fusionnée dès que ses 3 pièces sont disponibles), mais le dépôt sur le radeau est **ordonné visuellement** (mission 1 puis 2 puis 3 puis 4 puis 5).
- Le visuel du radeau n’évolue qu’après **drag & drop de l’objet fusionné vers la zone du radeau** ; une fusion seule ne met pas à jour le radeau.
- La progression textuelle affichée est le compteur dynamique **`x/5`** basé sur les objets fusionnés réellement déposés sur le radeau.
- Après chaque fusion réussie, une modal « objet fusionné » est affichée avec les visuels `public/raft/popup_merged_object-01.webp` à `-05.webp` dans l’ordre des missions.
- Quand l’audio description est activée, le bouton mégaphone de la zone de fusion est positionné à droite en absolu pour ne pas modifier la hauteur du conteneur gauche.
- Règles de fusion : les 3 pièces doivent venir de la même mission ; sinon feedback d’erreur et réinitialisation des slots.

#### Outro (radeau terminé)

- Déclenchement : lorsque les **5 objets fusionnés** sont déposés sur le radeau (`placedOnRaft.length === 5`), si l’outro n’a pas déjà été vu (`uiStore.raftOutroCompleted`).
- **Étape 1** — `RaftCompleteModal` : fond `backgrounds/background_journal.webp`, message « Félicitations ! Tu as construit le radeau ! », visuel central `radeauM5.png`, bouton Suivant en bas à droite. **Mobile** : contenu scrollable (`overflow-y-auto`), `safe-area-inset`, hauteur image réduite, bouton Suivant **sticky** en bas pour rester visible malgré la barre du navigateur.
- **Étape 2** — `OutroNarrativeScreen` : 5 bulles Yandel sur fond `public/outro/background_end.jpeg` (`NarrativeDialogueLayout` + typewriter + audio description comme l’intro).
- Fin de la narration : `markRaftOutroCompleted()`, redirection vers `/carte-de-l-ile`. L’outro ne se rejoue pas tant que la session UI n’est pas réinitialisée (nouvelle partie).

#### Responsive et cibles tactiles (`app/radeau/page.tsx`)

- Helper **`getRaftDndTouchSizes()`** (dans la page) : tailles en pixels selon `useResponsive()`, avec un plancher **`MIN_RAFT_TOUCH_PX` = 48** (WCAG 2.5.5 / recommandations Material).
- **Inventaire** : grille `3 × 5` en pixels fixes (`gridTemplateColumns` / `gridTemplateRows`), pas de `1fr` qui réduisait les cases sous la hauteur utile en mobile paysage.
  - Exemples de tailles de case : **64 px** (mobile petit, h &lt; 600), **72 px** (mobile moyen), **76–88 px** (tablette / desktop).
  - Largeur du panneau droit = `3 × slot + padding` (calculée, plus de `aspect-ratio` rigide sur le panneau).
- **Slots de fusion** (sous le radeau) : carrés à taille fixe (`mergeSlotPx`, ex. **60–84 px**), grille `repeat(3, …px)` avec espacement explicite.
- **`DragOverlay`** : même taille que les cases d’inventaire (`dragOverlayPx`) pour un retour visuel cohérent pendant le drag.
- **Panneau inventaire** : colonne flex (`header` fixe + zone grille scrollable), `h-full` / `max-h-[96dvh]`, **`items-start`** sur la zone scroll (la première rangée reste visible en haut ; évite le centrage vertical qui masquait le haut des images sur mobile).
- Alignement avec les mini-jeux drag (`DragOrderImagesGame`, etc.) : tailles explicites + `useDndSensors` (`activationConstraint: { distance: 8 }`) + `touch-none` sur les éléments draggables.

---

## 5. Moteurs métier (`lib/engine/`)

Fonctions **pures** (sans React), testables unitairement :

- **missionEngine** : mission complète, step suivant, index, pourcentage de progression ; **`isMissionAccessible`** et **`canAccessMissionStep`** pour le contrôle d’accès aux routes step (voir §3).
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
| `uiStore`               | Badges « Nouveau » sur la carte : `viewedMissions`, `viewedRaftMissions`, `lastViewedCompletedMission`, `raftOutroCompleted` (clé `escape_game_ui`). |

Persistance via middleware `persist` ; les noms de clés de stockage sont centralisés dans `lib/constants.ts`.

### Badges « Nouveau » (`app/carte-de-l-ile/page.tsx` + `uiStore`)

Indicateurs visuels (`public/ui/icon_new.webp`) sur la carte de l’île. Les états « vus » sont persistés dans `sessionStorage` via `uiStore`.

| Emplacement | Condition d’affichage | Disparition |
| ----------- | --------------------- | ----------- |
| **Mission** | Mission débloquée, aucun step complété, pas encore cliquée | Clic sur la mission (`markMissionAsViewed`) |
| **Radeau** | Mission terminée dont les 3 pièces sont en inventaire (non fusionnées) et pas encore « vue » au radeau | Clic sur l’icône Radeau (`markRaftMissionAsViewed` pour chaque mission concernée) |
| **Journal** | Au moins une mission terminée dont le contenu n’a pas encore été consulté depuis la complétion | Clic sur l’icône Journal (`setLastViewedCompletedMission` avec la dernière mission complétée) |

Le suivi radeau et journal est **par mission complétée** : une nouvelle mission terminée réactive le badge correspondant même si l’utilisateur l’avait déjà consulté pour une mission précédente.

### Menu Paramètres (`app/carte-de-l-ile/page.tsx`)

- Bouton **Paramètres** (bas droite) : menu déroulant vers le haut avec Audio description, Aide à la lecture (toggle), Mentions légales, Politique de confidentialité, Nouvelle partie.
- **Mobile** (`max-width: 767px`) : le libellé texte est remplacé par une **icône engrenage** (SVG inline) pour limiter la largeur du bouton ; `aria-label` et bouton « Lire à voix haute » inchangés. **Tablette / desktop** : libellé « Paramètres » conservé.
- **DYS actif** : `globals.css` applique une interligne compacte sur `[role="menu"]` pour éviter que le menu dépasse l’écran ; `maxHeight` + scroll sur le menu pour garder **Audio description** visible en haut.

**Réinitialisation complète (Nouvelle partie)** : `resetProgress()` + `resetInventory()` + `resetUI()` + `resetAudioDescription()` + `resetReadingAid()` — tous les stores sont remis à zéro, ce qui redéclenche le workflow intro (AD + DYS) au prochain clic sur JOUER.

---

## 7. Découpage des composants

### 7.1 `components/game/` — coquille autour du step

| Composant                 | Responsabilité                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **`GameRenderer`**        | Seul endroit qui connaît la carte **type de jeu → composant**. Reçoit `Step` + callbacks `onComplete` / `onDefeat`, et **`questionContainerVisible`** (barre latérale Instruction) pour les jeux qui affichent un panneau consigne : QCM, `drag-select-image`, `drag-order-images`, `basket-weight`, énigmes, photosynthèse, etc. |
| **`StepBackground`**      | Fond d’écran statique avec image, contenu enfant centré (zone de jeu).                                              |
| **`ClickableBackground`** | Fond + zones cliquables (indices sur le décor) ; enrobe souvent le `GameRenderer`.                                  |
| **`OrientationGuard`**    | Contexte dimensions / orientation ; overlay paysage via `LandscapeEnforcer` sauf `allowPortrait`.                   |
| **`LandscapeEnforcer`**   | Message bloquant si portrait (contrainte produit).                                                                  |
| **`OrientationProvider`** | Variante provider si utilisée ailleurs.                                                                             |

### 7.2 `components/game/step-page/` — page `/[missionId]/[stepSlug]`

Découpage de l’**écran step** pour limiter la taille de la page :

| Composant               | Responsabilité                                                                                                        |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **`StepPageNarrative`** | Écran narration avant le mini-jeu (premier step non complété avec `step.narrative`). Orchestre slides, typewriter et navigation ; délègue le rendu à `NarrativeDialogueLayout`. |
| **`StepPageSidebar`**   | Bandeau gauche : titre mission/étape, description audio, bascule instruction/inspecter, indice, radeau, retour carte. |
| **`StepPageModals`**    | Modales : défaite, objet radeau, indices (général / image), fin de mission (`MissionCompleteModal`).                  |

La page `app/[missionId]/[stepSlug]/page.tsx` orchestre : chargement du step, progression (`useGameProgress`, `useInventory`), garde d’accès (`useGameStoreHydrated`, `canAccessMissionStep` — voir §3), effets (audio auto), et branchement **ClickableBackground** vs **StepBackground** selon `backgroundHintZones`.

### 7.3 `components/games/` — mini-jeux par domaine

Organisation par **famille** de mécanique :

| Dossier                  | Exemples                                                                                                         |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **`games/qcm/`**         | `QCMGame`, `QCMOption`                                                                                           |
| **`games/drag/`**        | Tri, sélection d’images, paniers, bouteille, ordre d’images, **photosynthèse** (`PhotosynthesisAtomsGame`), etc. |
| **`games/enigma/`**      | Saisie / décodage (`EnigmaGame`), cibles point-clic multi-énigmes (`PointClickMultiEnigmaGame`)                  |
| **`games/image-click/`** | Clic sur zones dans une image (`ImageClickGame`)                                                                 |

Les jeux drag utilisent en général `hooks/useDndSensors` et `hooks/useDndCollisionDetection` avec `DndContext`. La page **`/radeau`** suit la même stack et applique en plus `getRaftDndTouchSizes()` pour dimensionner inventaire, slots de fusion et `DragOverlay` (voir § 4 — Radeau).

#### Photosynthèse — mission 2 step 3 (`PhotosynthesisAtomsGame`)

- Type de jeu : `photosynthesis-atoms` (`data/missions/mission-2/steps/step-3.ts`).
- Deux panneaux : grille d’**atomes** draggables (gauche) + liste des **recettes** (droite) ; 3 slots de fusion + bouton « Fusionner ».
- **Cibles tactiles mobile** : plancher **48 px** (`MIN_TOUCH_PX`) ; tailles atomes ~**12 %** de `windowHeight` (min. 48 px) ; slots de fusion ~**110 %** de la taille atome.
- **Mobile paysage** : hauteur de jeu limitée à `playAreaMaxHeight` (viewport − barre de consigne − padding) pour tenir compte de la **barre du navigateur** ; barre de question en **`dvh`** + `safe-area-inset-bottom`.
- **Panneau droit (recettes)** : `overflow-y: auto` sur mobile si le contenu dépasse ; panneau gauche (atomes) scrollable si besoin.
- Mode **inspecter** : zones cliquables sur le fond (`inspectTargets`) + modal d’indice.

#### Panier au poids — missions 4 step 2 & 5 step 3 (`BasketWeightGame`)

- Type de jeu : `basket-weight` (lianes / gourde, compteurs par type, dépassement = écran bloqué + reset).
- **Panneau droit** (consigne + panier + compteurs + bouton reset) : `maxHeight` basé sur `--app-viewport-height` / `dvh`, **`overflow-y-auto`** sur le panneau et sur la colonne des compteurs si le contenu dépasse (barre du navigateur mobile).
- **Instruction** (barre latérale) : masque la ligne de consigne du panneau via `questionContainerVisible` (comme les autres mini-jeux à panneau).

#### Sélection d’images — ex. mission 3 step 1 (`DragSelectImageGame`)

- Type de jeu : `drag-select-image` ; panneau consigne (titre + texte) masquable via **`questionContainerVisible`** (bouton Instruction de `StepPageSidebar`).

### 7.4 `components/ui/` — transverse

Boutons (`Button`, `IconButton`, `ContinueButton`), **modales** (`Modal`, `DefeatModal`, `MissionCompleteModal`, `RaftCompleteModal`, légales…), **accessibilité** (`ReadAloudButton`, `AudioDescriptionProvider`, `SkipLink`, `AudioDescriptionButton`), **PWA** (`PWAInstallPrompt`), **`BeforeUnloadWarning`**, barre de progression, etc.

| Composant | Responsabilité |
| --------- | -------------- |
| **`BeforeUnloadWarning`** | Avertissement navigateur (`beforeunload`) si une partie est en cours (`gameStore`). Délégation à `lib/navigation/unloadWarning.ts` : **pas d’alerte** en navigation interne (router, liens même origine, barre d’URL vers le site), rechargement, ni quand les données `sessionStorage` persistent ; alerte conservée à la **fermeture d’onglet** / sortie hors site. |
| **`RaftCompleteModal`** | Popup félicitations après radeau terminé (fond `background_journal.webp`, `radeauM5.png`). Responsive mobile : scroll, safe-area, bouton Suivant toujours accessible. |

Composants d'accessibilité intro :

| Composant                           | Responsabilité                                                                                                                                                                                                                                                                                                         |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`IntroAccessibilityChoiceModal`** | Modal générique Oui/Non utilisée pour les 2 écrans du workflow intro (AD puis DYS). Props : `acronym` ("AD" \| "DYS"), `question`, `onYes`, `onNo`. Fond parchemin, titre grand, boutons orange.                                                                                                                       |
| **`ReadingAidEffect`**              | Composant sans rendu (`null`) monté dans le layout. Ajoute/retire la classe `reading-aid-enabled` sur `<html>` selon `readingAidStore.readingAidEnabled`.                                                                                                                                                              |

### 7.5 `components/ui/narrative/` — écrans narratifs (intro + missions)

Layout partagé entre `IntroNarrativeScreen` et `StepPageNarrative`.

| Composant / module | Responsabilité |
| ------------------ | -------------- |
| **`NarrativeDialogueLayout`** | Fond configurable (`backgroundImageUrl`, défaut intro ; outro : `outro/background_end.jpeg`), Yandel en bas à gauche, **titre du step au-dessus de la bulle** (missions uniquement), corps centré H+V dans `bullebd.webp`, bouton Suivant, `ReadAloudButton`. |
| **`useNarrativeTypewriter`** | Effet typewriter (30 ms/caractère) ; `revealAll()` si Suivant pendant l'écriture. |
| **`narrativeTypography.ts`** | Tailles basées sur la hauteur (`useResponsive`) ; pas de césure auto. |
| **`slidesFromNarrative.ts`** | Découpe `step.narrative` : double saut de ligne → slide ; saut simple → espace ; chaque slide passe par **`formatYandelDialogue`**. |
| **`formatYandelDialogue.ts`** | Encadre le texte avec des **guillemets français** `« … »` s’il ne l’est pas déjà (voix de Yandel). Utilisé par `slidesFromNarrative`, `IntroNarrativeScreen` (`INTRO_SLIDES`) et `OutroNarrativeScreen` (`OUTRO_SLIDES`). |

**Règles d'affichage et rédaction (`step.narrative`) :**

- Affiché au **premier step** d'une mission si `step.narrative` est défini et le step non complété.
- **Guillemets** : à l’affichage, tout texte narratif est encadré par `« … »` pour indiquer que **Yandel parle** (intro, outro, début de mission) ; les données peuvent déjà contenir les guillemets — pas de double encadrement.
- Intro courte (~250–300 caractères) : **un seul slide** (accroche + consigne dans le même bloc).
- Double saut de ligne dans les données : nouveau slide uniquement pour un **vrai changement de beat** (texte long), jamais au milieu d'une citation.
- Pas de pagination automatique selon le viewport ; scroll invisible en secours si un bloc dépasse.

| Composant | Responsabilité |
| --------- | -------------- |
| **`IntroNarrativeScreen`** | Après workflow AD/DYS : 3 slides (présentation Yandel, île / questions, bonne chance) via layout partagé (sans titre), guillemets appliqués à l’affichage, puis carte de l'île. Auto-play audio si activé. Prop `onComplete`. |
| **`OutroNarrativeScreen`** | 5 slides de clôture après `RaftCompleteModal` ; guillemets appliqués à l’affichage ; fond `outro/background_end.jpeg`. |

---

## 8. Hooks et bibliothèques utiles (`hooks/`, `lib/`)

- **Progression** : `useGameProgress`, `useInventory`.
- **Responsive** : `useResponsive`, `useMediaQuery`, `useOrientation` (contexte depuis `OrientationGuard`).
- **DnD** : `useDndSensors`, `useDndCollisionDetection` (collision stable, adaptée au paysage forcé).
- **Accessibilité** : `useAudioDescription`, `useFocusTrap`, `useFullscreen`.
- **Utilitaires** : `lib/utils/logger`, stockage typé, `lib/navigation.ts`, **`lib/navigation/unloadWarning.ts`** (garde `beforeunload`).

---

## 9. Assets publics (`public/`)

- **`/missions/mission-N/step-M/`** : images et médias **spécifiques** à un step (données qui référencent ces chemins).
- **`/ui/`** : icônes et éléments d’interface **réutilisables** (dont constantes par défaut dans `lib/constants.ts` le cas échéant).
- **`/backgrounds/`**, **`/raft/`**, **`/outro/`** : fonds communs, pièces de radeau, fin de parcours (`background_end.jpeg`).

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
