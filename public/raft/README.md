# Images des pièces du radeau

Ce dossier contient les images des pièces du radeau que Yandel collecte tout au long de son aventure.

## Structure attendue

Le jeu contient **15 pièces au total** (5 missions × 3 steps).

Les fichiers livrés sont nommés selon le format suivant :

```
radeau_photo-XX.webp
```

Où `XX` va de `01` à `15` (ordre mission puis step).

## Liste des fichiers à fournir

### Mission 1

- `radeau_photo-01.webp` - Pièce collectée après le step 1
- `radeau_photo-02.webp` - Pièce collectée après le step 2
- `radeau_photo-03.webp` - Pièce collectée après le step 3

### Mission 2

- `radeau_photo-04.webp`
- `radeau_photo-05.webp`
- `radeau_photo-06.webp`

### Mission 3

- `radeau_photo-07.webp`
- `radeau_photo-08.webp`
- `radeau_photo-09.webp`

### Mission 4

- `radeau_photo-10.webp`
- `radeau_photo-11.webp`
- `radeau_photo-12.webp`

### Mission 5

- `radeau_photo-13.webp`
- `radeau_photo-14.webp`
- `radeau_photo-15.webp`

## Spécifications techniques

- **Format** : WEBP, PNG ou JPG
- **Taille recommandée** : À définir avec le client
- **Transparence** : PNG avec transparence si possible pour un meilleur rendu

## Fonctionnement

- Chaque step complété débloque automatiquement sa pièce associée (`inventoryStore`, persisté en **sessionStorage**)
- L’assemblage et la fusion se font sur la route **`/radeau`** (`app/radeau/page.tsx`) : inventaire 15 cases, 3 slots de fusion, dépôt des objets fusionnés sur le radeau
- Visuels d’étapes du radeau : `radeau_base.png`, `radeauM1.png` … `radeauM5.png` ; objets fusionnés : `merged_photo-*.webp`, modales : `popup_merged_object-*.webp`
- Documentation technique : `docs/architecture.md` (section **Radeau**, responsive et cibles tactiles)

## Outro (radeau terminé)

Quand les **5 objets fusionnés** sont déposés sur le radeau :

1. **`RaftCompleteModal`** — félicitations (fond `backgrounds/background_journal.webp`, visuel `radeauM5.png`). Sur mobile, popup scrollable et bouton Suivant toujours visible (voir `docs/architecture.md`, § Outro).
2. **`OutroNarrativeScreen`** — 5 slides de narration finale (fond `public/outro/background_end.jpeg`).

L’état `raftOutroCompleted` (`uiStore`, clé `escape_game_ui`) évite de rejouer cette séquence tant que l’élève ne lance pas une **Nouvelle partie**. Voir `docs/architecture.md` (§ Outro).

## Note importante

Ces 15 images correspondent aux assets fournis par le client et sont déjà intégrées dans `data/raft.ts`.
