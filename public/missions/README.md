# 📁 Guide : Images et Assets des Missions

## Vue d'ensemble

Ce dossier contient toutes les images et assets pour les différentes missions du jeu.

---

## 🎮 Mission 1 - Step 1 : Jeu avec zones cliquables (indices sur l’image)

### Fonctionnalité

Le step 1 combine :

- **Une image de fond** affichée en `object-contain` (toujours entièrement visible, même taille relative quel que soit l’écran).
- **Des zones cliquables** (cercles en %) : un clic dans une zone ouvre une modale d’indice (image seule ou texte + image).
- **Une énigme** (type `enigma`) : l’utilisateur doit compléter une phrase après avoir exploré les indices.

Les coordonnées des zones sont en **pourcentage (0–100)** par rapport à l’**image complète**. Ainsi, les zones restent au même endroit visuel sur tous les appareils (desktop, tablette, mobile, avec ou sans rotation).

### Pourquoi garder la même « taille » d’image ?

- L’image est affichée en **`object-contain`** dans son conteneur : elle est toujours entièrement visible, avec letterboxing (bandes) si le ratio du conteneur diffère du ratio de l’image.
- Le code utilise les **dimensions réelles** de l’image (chargée via `new Image()`) pour calculer la zone affichée (largeur/hauteur effective, offsets du letterboxing).
- Les clics sont convertis en **% par rapport à cette zone d’image**, pas par rapport au conteneur. Donc :
  - **Même image** → mêmes coordonnées (x, y, radius) partout.
  - Pas besoin de recalculer les coordonnées quand on change de device ou de taille d’écran.
- Sur mobile/tablette en portrait, l’UI est pivotée (OrientationGuard). Le composant transforme les coordonnées du clic du repère DOM vers le repère **visuel** pivoté avant d’appliquer le calcul `object-contain`, pour que les zones restent alignées avec l’image affichée.

### Fichiers concernés

- **Config du step** : `data/missions/mission-1/steps/step-1.ts`  
  - `backgroundImage`, `backgroundHintZones` (x, y, radius, title, hint, image), `game.type: "enigma"`.
- **Composant** : `components/game/ClickableBackground.tsx`  
  - Charge l’image pour obtenir ses dimensions, calcule les coordonnées (avec gestion de la rotation), détecte les clics dans les zones.
- **Intégration** : `app/[missionId]/[stepSlug]/page.tsx`  
  - Affiche le fond cliquable et les modales d’indice (image seule si `hint` vide, sinon texte + image).

### Référence step 1

- **Image de fond** : `/missions/mission-1/step-1/mission1_step1_valises.png`
- **Zones** : voir `backgroundHintZones` dans `step-1.ts` (plusieurs cercles, radius 1 ou 2, avec `image` pour les popups d’indice).
- **Exemple de zone** : `x: 10.33, y: 38.4, radius: 2` → ouvre `M1_S1_popup-indice-01.webp`.

---

## 🖼️ Structure des Images par Step

### Mission 1 - Step 3 : Jeu de Drag & Drop d'Images

**Chemin** : `/public/missions/mission-1/step-3/`

**Images nécessaires** :

- `image-1.jpg` - Première image source (sera correcte en position 1)
- `image-2.jpg` - Deuxième image source (mauvaise réponse)
- `image-3.jpg` - Troisième image source (sera correcte en position 2)
- `image-4.jpg` - Quatrième image source (mauvaise réponse)
- `image-5.jpg` - Cinquième image source (sera correcte en position 3)
- `fond_challenge.jpg` - Image de fond pour ce step

**Note** : L'ordre correct actuel est `[img-1, img-3, img-5]`. Modifier dans `data/missions/mission-1/steps/step-3.ts` si nécessaire.

---

## 📍 Guide : Zones Cliquables sur les Backgrounds

Ce système permet d'ajouter des zones cliquables sur les images de fond des steps qui affichent une modale d'indice quand l'utilisateur clique dessus.

## 🎯 Comment ça fonctionne

### 1. Préparer l'image

1. Demandez au client l'image de fond pour le step
2. Ajoutez un **cercle rose visible** (`#FF69B4` ou similaire) aux endroits où vous voulez placer des zones cliquables
3. Placez l'image dans : `/public/missions/mission-X/step-Y/nom-image.png`

### 2. Trouver les coordonnées exactes

#### Activer le mode debug

Dans `app/[missionId]/[stepSlug]/page.tsx` :

```typescript
<ClickableBackground
  imageSrc={step.backgroundImage || "/backgrounds/jungle.webp"}
  hintZones={step.backgroundHintZones}
  onHintClick={(hint) => setHintModal(hint)}
  debugMode={true}  // ← Activez ici
>
```

#### Trouver les coordonnées

1. Lancez le jeu et allez au step concerné
2. **Déplacez votre souris** : les coordonnées s'affichent en temps réel en haut à droite
3. **Cliquez 4 fois** sur le cercle rose (haut, bas, gauche, droite)
4. Dans la console du navigateur, notez les 4 coordonnées affichées

**Exemple de sortie console :**

```
🎯 Coordonnées du clic: x: 39.69, y: 47.81  (HAUT)
🎯 Coordonnées du clic: x: 39.84, y: 52.56  (BAS)
🎯 Coordonnées du clic: x: 38.28, y: 50.05  (GAUCHE)
🎯 Coordonnées du clic: x: 41.25, y: 49.77  (DROITE)
```

#### Calculer le centre et le rayon

```
Centre X = moyenne(gauche, droite) = (38 + 41) / 2 = 40
Centre Y = moyenne(haut, bas) = (48 + 53) / 2 = 50
Rayon = environ la moitié de la distance entre deux points opposés ≈ 3
```

### 3. Configurer le step

Dans `data/missions/mission-X/steps/step-Y.ts` :

```typescript
export const missionXStepY: Step = {
  id: "mission-X-step-Y",
  title: "Titre du step",
  instruction: "Instruction du jeu",
  narrative: "Texte narratif...",
  location: "Lieu",
  raftPiece: "piece-X",
  backgroundImage: "/missions/mission-X/step-Y/nom-image.png",

  // 👇 Zones cliquables sur le fond
  backgroundHintZones: [
    {
      x: 40, // Centre X (en %)
      y: 50, // Centre Y (en %)
      radius: 3, // Rayon de la zone cliquable (en %)
      hint: "Ton indice ici !", // Message à afficher
    },
    // Vous pouvez ajouter plusieurs zones
    {
      x: 70,
      y: 30,
      radius: 4,
      hint: "Un autre indice caché !",
    },
  ],

  hint: {
    text: "Indice optionnel du bouton d'aide",
  },

  game: {
    type: "enigma",
    text: "Énigme à résoudre...",
  },
};
```

### 4. Désactiver le mode debug

⚠️ **Important** : Une fois les coordonnées trouvées, désactivez le debug :

```typescript
debugMode={false}  // ← Production
```

## 📐 Système de coordonnées

- **x, y** : Pourcentage (0–100) du **centre** de la zone par rapport à l’image **complète** (largeur et hauteur).
- **radius** : Rayon du cercle cliquable, en **pourcentage** de l’image (ex. 1 = petit, 2–3 = moyen, 4–5 = grand).
- L’affichage utilise **`object-contain`** : l’image est toujours entièrement visible ; si le ratio du conteneur diffère de celui de l’image, des bandes (letterboxing) apparaissent. Le calcul tient compte de la zone réelle occupée par l’image dans le conteneur.
- Les coordonnées sont calculées par rapport à cette **zone d’image** (dimensions réelles chargées côté client), pas par rapport au viewport. Ainsi, **les mêmes valeurs (x, y, radius) restent valides sur tous les écrans et devices**.
- **Rotation (mobile/tablette portrait)** : le conteneur peut être pivoté (OrientationGuard). Les coordonnées du clic sont d’abord transformées du repère DOM vers le repère visuel pivoté (`(x_visuel, y_visuel) = (y_DOM, width_DOM - x_DOM)`), puis le calcul `object-contain` est appliqué dans ce repère. Les zones restent donc alignées avec l’image affichée.

## 🎨 Exemple complet (Step 1)

Voir : `data/missions/mission-1/steps/step-1.ts` :

- **Image de fond** : `/missions/mission-1/step-1/mission1_step1_valises.png`
- **Zones** : plusieurs `backgroundHintZones` avec x, y, radius (1 ou 2), et `image` pour la modale d’indice (ex. `M1_S1_popup-indice-01.webp`). Pas de texte `hint` → modale image seule.
- Pour ajouter une zone : activer `debugMode={true}` sur `ClickableBackground`, cliquer sur l’image, noter les coordonnées en console, puis ajouter une entrée dans `backgroundHintZones` (centre x, y et radius en %).

## 🔧 Fichiers concernés

- **Composant principal** : `components/game/ClickableBackground.tsx`
- **Intégration** : `app/[missionId]/[stepSlug]/page.tsx`
- **Types** : `types/step.ts` → `BackgroundHintZone`

## 💡 Conseils

1. **Radius** : Utilisez 1–2 pour des zones précises, 3–5 pour des zones plus larges. Ajustez selon la taille visuelle souhaitée sur l’image.
2. **Multiple zones** : Plusieurs cercles peuvent partager la même modale (même `image`, même indice).
3. **Garder la même taille d’image** : Ne pas changer le ratio ou recadrer l’image de fond sans recalculer les coordonnées. Utiliser toujours la même image (ou une image aux mêmes dimensions) pour conserver les mêmes (x, y, radius).
4. **Test** : Tester sur desktop, tablette et mobile (y compris en portrait avec rotation) pour vérifier l’alignement des zones.
5. **Mode debug** : Avec `debugMode={true}`, les cercles des zones sont affichés (bordure rose) et les coordonnées des clics sont loguées en console. Désactiver en production.

## 🔧 Pour les jeux de type "image-click"

Si vous utilisez un jeu de type `image-click` (où l'utilisateur doit cliquer sur des zones précises de l'image), le système calcule automatiquement les coordonnées correctement en tenant compte :
- Des dimensions réelles de l'image
- Du ratio du conteneur vs ratio de l'image
- Du letterboxing (bandes noires) si nécessaire

Les coordonnées dans `clickableZones` doivent être en pourcentage (0-100) par rapport à l'image complète, exactement comme pour `backgroundHintZones`.
