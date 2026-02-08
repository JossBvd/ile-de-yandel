# 📁 Guide : Images et Assets des Missions

## Vue d'ensemble

Ce dossier contient toutes les images et assets pour les différentes missions du jeu.

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

Dans `app/game/mission/[missionId]/step/[stepId]/page.tsx` :

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

- **x, y** : Pourcentage (0-100) de la position sur l'image
- **radius** : Pourcentage de l'image (rayon du cercle cliquable)
- L'image utilise `object-cover` : elle remplit tout l'écran, peut être croppée
- Les coordonnées sont calculées par rapport à l'image **complète** (pas l'écran)

## 🎨 Exemple complet

Voir : `data/missions/mission-1/steps/step-1.ts` qui utilise :

- Image : `/public/missions/mission-1/step-1/jungle_test.png`
- Zone cliquable : cercle rose à x:40, y:50, radius:3

## 🔧 Fichiers concernés

- **Composant principal** : `components/game/ClickableBackground.tsx`
- **Intégration** : `app/game/mission/[missionId]/step/[stepId]/page.tsx`
- **Types** : `types/step.ts` → `BackgroundHintZone`

## 💡 Conseils

1. **Radius** : Commencez avec `3-5` et ajustez selon la taille du cercle
2. **Multiple zones** : Vous pouvez avoir plusieurs cercles sur une même image
3. **Test** : Testez toujours sur mobile et desktop (ratios différents)
4. **Suppression** : Une fois les vraies images reçues, supprimez les `*_test.png`
