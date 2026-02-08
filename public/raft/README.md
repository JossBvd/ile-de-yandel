# Images des pièces du radeau

Ce dossier contient les images des pièces du radeau que Yandel collecte tout au long de son aventure.

## Structure attendue

Le jeu contient **15 pièces au total** (5 missions × 3 steps).

Chaque pièce doit être nommée selon le format suivant :

```
mission-[X]-step-[Y].png
```

Où :

- `X` = Numéro de la mission (1 à 5)
- `Y` = Numéro du step (1 à 3)

## Liste des fichiers à fournir

### Mission 1

- `mission-1-step-1.png` - Pièce collectée après le step 1
- `mission-1-step-2.png` - Pièce collectée après le step 2
- `mission-1-step-3.png` - Pièce collectée après le step 3

### Mission 2

- `mission-2-step-1.png`
- `mission-2-step-2.png`
- `mission-2-step-3.png`

### Mission 3

- `mission-3-step-1.png`
- `mission-3-step-2.png`
- `mission-3-step-3.png`

### Mission 4

- `mission-4-step-1.png`
- `mission-4-step-2.png`
- `mission-4-step-3.png`

### Mission 5

- `mission-5-step-1.png`
- `mission-5-step-2.png`
- `mission-5-step-3.png`

## Spécifications techniques

- **Format** : PNG ou JPG
- **Taille recommandée** : À définir avec le client
- **Transparence** : PNG avec transparence si possible pour un meilleur rendu

## Fonctionnement

- Chaque step complété débloque automatiquement sa pièce associée
- Les pièces sont sauvegardées dans le localStorage du navigateur
- L'inventaire complet sera accessible via un bouton d'interface (à implémenter)
- Une fois toutes les pièces collectées, le radeau sera complet et le joueur pourra quitter l'île

## Note importante

⚠️ Ces images sont **placeholders pour le moment**. Les vraies images seront fournies par le client ultérieurement.
