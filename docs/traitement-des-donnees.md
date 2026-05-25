# Fiche de traitement des données — Le crash de Yandel

**Application :** Le crash de Yandel — escape game éducatif web  
**Public visé :** Élèves de 6ᵉ et 5ᵉ  
**Nature :** Application web progressive (PWA), frontend uniquement, sans backend métier  
**Date de rédaction :** Mai 2026

---

## 1. Résumé exécutif

L'application **ne collecte aucune donnée personnelle au sens strict** (ni nom, ni prénom, ni date de naissance, ni identifiant scolaire, ni adresse e-mail). Aucun compte utilisateur n'est créé. Aucune donnée saisie ou générée par le jeu n'est transmise à un serveur applicatif. Toutes les informations de session sont stockées **localement dans le navigateur de l'appareil utilisé** et sont effacées automatiquement à la fermeture du navigateur ou de l'onglet.

Les logs du serveur web (Nginx) contiennent des adresses IP **anonymisées** avant écriture (dernier octet tronqué) et sont supprimés après 7 jours.

---

## 2. Responsable de traitement

| Champ | Valeur |
|---|---|
| Entité | *(à compléter par le client)* |
| Contact DPO / référent RGPD | *(à compléter)* |
| Hébergeur de l'application (VPS) | *(à compléter — ex. OVH, Scaleway, etc.)* |

> Sur un VPS, l'opérateur du serveur est **responsable de traitement** pour les logs Nginx. Cette responsabilité est distincte de celle de l'hébergeur physique des machines.

---

## 3. Finalité du traitement

Le traitement des données a pour **seule finalité** de permettre le fonctionnement du jeu : maintien de la progression pédagogique, mémorisation des préférences d'accessibilité et affichage du pseudonyme saisi par l'élève le temps d'une session de jeu.

Il n'existe **aucune finalité secondaire** (analyse comportementale, marketing, profilage, partage avec des tiers).

---

## 4. Base légale

| Catégorie | Base légale (RGPD art. 6) |
|---|---|
| Données de progression et préférences | **Intérêt légitime** — nécessaire au bon fonctionnement du service éducatif demandé par l'utilisateur |
| Pseudonyme | **Consentement de fait** — saisi volontairement par l'élève avant de jouer |
| Logs serveur (IP anonymisée, user-agent, URL) | **Intérêt légitime** — nécessaire à la sécurité et à la disponibilité du service |

---

## 5. Données traitées — inventaire complet

### 5.1 Pseudonyme du joueur

| Attribut | Détail |
|---|---|
| **Nature** | Chaîne de caractères saisie librement par l'élève (texte libre) |
| **Exemples** | « SuperYandel », « Joueur42 » |
| **Contraintes** | Maximum 20 caractères ; les caractères `< > " '` sont automatiquement supprimés (prévention XSS) |
| **Clé de stockage** | `playerPseudo` |
| **Lieu de stockage** | `sessionStorage` du navigateur |
| **Durée** | Jusqu'à fermeture de l'onglet ou du navigateur |
| **Transmission** | Aucune — reste dans le navigateur |
| **Remarque** | L'élève n'est pas obligé de saisir son vrai prénom ; tout pseudonyme est accepté |

---

### 5.2 Progression de jeu

| Attribut | Détail |
|---|---|
| **Nature** | Identifiants techniques des missions et étapes (steps) complétés |
| **Exemples** | `{ currentMissionId: "mission-2", completedSteps: ["mission-1-step-1", "mission-1-step-2"], completedMissions: ["mission-1"] }` |
| **Clé de stockage** | `escape_game_progress` |
| **Lieu de stockage** | `sessionStorage` du navigateur |
| **Durée** | Jusqu'à fermeture de l'onglet ou du navigateur |
| **Transmission** | Aucune |
| **Champs stockés** | `currentMissionId`, `currentStepId`, `completedSteps[]`, `completedMissions[]` |

---

### 5.3 Inventaire (pièces du radeau)

| Attribut | Détail |
|---|---|
| **Nature** | Identifiants techniques des pièces de radeau collectées et fusionnées au cours de la session |
| **Exemples** | `{ collectedPieces: ["mission-1-piece-1"], fusedPieces: ["fused-1"], placedOnRaft: [1] }` |
| **Clé de stockage** | `escape_game_inventory` |
| **Lieu de stockage** | `sessionStorage` du navigateur |
| **Durée** | Jusqu'à fermeture de l'onglet ou du navigateur |
| **Transmission** | Aucune |
| **Champs stockés** | `collectedPieces[]`, `fusedRaftPiecesCount`, `fusedPieces[]`, `fusionHistory[]`, `placedOnRaft[]` |

---

### 5.4 Indices consultés

| Attribut | Détail |
|---|---|
| **Nature** | Identifiants techniques des étapes pour lesquelles l'élève a demandé un indice |
| **Exemples** | `{ usedHints: ["mission-2-step-1"] }` |
| **Clé de stockage** | `escape_game_hints` |
| **Lieu de stockage** | `sessionStorage` du navigateur |
| **Durée** | Jusqu'à fermeture de l'onglet ou du navigateur |
| **Transmission** | Aucune |
| **Remarque** | Seul le fait d'avoir consulté un indice est enregistré (booléen par étape), pas les réponses saisies |

---

### 5.5 Préférences d'audiodescription

| Attribut | Détail |
|---|---|
| **Nature** | Choix d'accessibilité exprimé par l'élève lors du workflow d'introduction |
| **Clé de stockage** | `escape_game_audio_description` |
| **Lieu de stockage** | `sessionStorage` du navigateur |
| **Durée** | Jusqu'à fermeture de l'onglet ou du navigateur |
| **Transmission** | Aucune |
| **Champs stockés** | `audioDescriptionEnabled` (booléen), `audioDescriptionAutoPlay` (booléen), `audioDescriptionSpeed` (valeur parmi 0,5 / 1 / 1,5 / 2), `audioDescriptionFirstVisitDone` (booléen interne) |

---

### 5.6 Préférences d'aide à la lecture (DYS)

| Attribut | Détail |
|---|---|
| **Nature** | Choix d'accessibilité exprimé par l'élève lors du workflow d'introduction |
| **Clé de stockage** | `escape_game_reading_aid` |
| **Lieu de stockage** | `sessionStorage` du navigateur |
| **Durée** | Jusqu'à fermeture de l'onglet ou du navigateur |
| **Transmission** | Aucune |
| **Champs stockés** | `readingAidEnabled` (booléen), `readingAidFirstVisitDone` (booléen interne), `introWorkflowDone` (booléen interne) |

---

### 5.7 État d'interface utilisateur

| Attribut | Détail |
|---|---|
| **Nature** | Marqueurs internes de navigation (missions et pages visitées) permettant d'afficher ou non des indicateurs visuels de nouveauté (notifications) |
| **Clé de stockage** | `escape_game_ui` |
| **Lieu de stockage** | `sessionStorage` du navigateur |
| **Durée** | Jusqu'à fermeture de l'onglet ou du navigateur |
| **Transmission** | Aucune |
| **Champs stockés** | `viewedMissions[]` (missions cliquées sur la carte), `viewedRaftMissions[]` (missions dont les pièces à fusionner ont été consultées au radeau), `lastViewedCompletedMission` (dernière mission terminée dont le journal a été ouvert), `raftOutroCompleted` (booléen : narration de fin après radeau terminé déjà vue), `journalViewed` (booléen legacy, non utilisé pour l’affichage des badges) |
| **Finalité** | Afficher ou masquer les indicateurs « Nouveau » sur la carte de l’île (missions, radeau, journal de bord) ; éviter de rejouer l’outro narrative après construction complète du radeau |

---

### 5.8 Marqueur de refus de l'invite d'installation PWA

| Attribut | Détail |
|---|---|
| **Nature** | Marqueur booléen indiquant que l'élève a refusé l'invite d'installation de l'application durant la session en cours |
| **Clé de stockage** | `pwa-install-dismissed` |
| **Lieu de stockage** | `sessionStorage` du navigateur |
| **Durée** | Jusqu'à fermeture de l'onglet ou du navigateur |
| **Transmission** | Aucune |
| **Remarque** | L'invite réapparaît à chaque nouvelle session. Ne contient aucune information personnelle. Entièrement optionnel (déclenché uniquement si l'élève clique sur « Plus tard »). |

---

## 6. Récapitulatif des mécanismes de stockage

| Mécanisme | Données stockées | Durée de vie |
|---|---|---|
| `sessionStorage` | Pseudonyme, progression, inventaire, indices, préférences d'accessibilité, état UI (dont `raftOutroCompleted`), marqueur de refus PWA | Effacé à la fermeture de l'onglet ou du navigateur |
| `localStorage` | Aucune | — |
| Cookies | Aucun cookie applicatif | — |
| Serveur / base de données | Aucune | — |
| Logs Nginx (VPS) | IP anonymisée, user-agent, URL, code HTTP, horodatage | 7 jours (logrotate) |

> **Note technique :** Les polices de caractères (Baloo 2, Lexend) sont téléchargées et auto-hébergées lors de la compilation du projet grâce à `next/font/google`. En production, **aucune requête n'est envoyée vers les serveurs Google** à l'utilisation du jeu.

---

## 7. Données non collectées (liste explicite)

L'application **ne collecte pas** côté client :
- Nom ou prénom réel de l'élève
- Date de naissance
- Identifiant scolaire (INE, numéro de classe, etc.)
- Adresse e-mail ou numéro de téléphone
- Adresse IP de l'élève (non accessible depuis le code JavaScript — anonymisée au niveau du serveur avant toute écriture dans les logs, voir §8.1)
- Données de géolocalisation
- Données biométriques
- Données de santé
- Historique de navigation externe
- Réponses saisies dans les mini-jeux (seul le résultat succès / échec est utilisé)
- Cookies tiers ou traceurs publicitaires
- Données d'analyse comportementale (analytics)

---

## 8. Tiers destinataires

| Tiers | Nature des échanges | Données transmises |
|---|---|---|
| **Serveur d'hébergement (VPS)** | Échanges techniques HTTP habituels (téléchargement des pages, images, sons) | Logs serveur : adresse IP **anonymisée** (voir §8.1), user-agent, URL, horodatage |
| **Tiers applicatifs** | Aucun | Aucune |

### 8.1 Traitement des logs serveur (VPS)

L'application est hébergée sur un **VPS** dont l'opérateur est le **responsable de traitement** pour les logs du serveur web (Nginx). À ce titre, les mesures suivantes sont appliquées :

| Mesure | Détail |
|---|---|
| **Anonymisation des IPs** | Le dernier octet de chaque adresse IPv4 est remplacé par `0` avant écriture dans les logs (ex. `192.168.1.42` → `192.168.1.0`). Le traitement équivalent est appliqué aux adresses IPv6. L'IP n'est jamais écrite en clair. Config : `deploy/nginx/nginx.conf`. |
| **Rétention limitée** | Les fichiers de logs sont supprimés après **7 jours** via `logrotate`. Config : `deploy/logrotate/le-crash-de-yandel`. |
| **Base légale** | Intérêt légitime (art. 6.1.f RGPD) — nécessaire à la sécurité et à la disponibilité du service. |
| **Responsable** | L'opérateur du VPS (à compléter en section 2), pas un tiers hébergeur. |

> Le contenu du `sessionStorage` (pseudonyme, progression, préférences) n'est **jamais** transmis au serveur. Seules les métadonnées HTTP standards figurent dans les logs.

---

## 9. Droits des personnes

Dans la mesure où l'application ne crée aucun compte, n'enregistre pas de données personnelles sur un serveur, et que les données sont stockées uniquement dans le navigateur local :

- **Droit d'accès, de rectification, d'effacement :** l'élève (ou son représentant légal) peut exercer ces droits directement depuis les paramètres du navigateur (« Effacer les données de navigation » / « Vider le cache »). Une fermeture de l'onglet ou du navigateur efface automatiquement l'intégralité des données.
- **Portabilité :** non applicable (données non transmises à un système central).

---

## 10. Mesures de sécurité

| Mesure | Description |
|---|---|
| **Sanitisation du pseudo** | Suppression des caractères `< > " '` et limitation à 20 caractères |
| **En-têtes HTTP de sécurité** | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection`, `Content-Security-Policy`, `Permissions-Policy` (caméra, micro, géolocalisation interdits) |
| **HTTPS obligatoire en production** | `Strict-Transport-Security` (HSTS) activé |
| **Anonymisation des logs Nginx** | Les adresses IP sont tronquées (dernier octet → `0`) avant toute écriture dans les fichiers de log. Aucune IP complète n'est jamais stockée sur le serveur. |
| **Rétention courte des logs** | Suppression automatique des logs après 7 jours via `logrotate`. |
| **Pas de backend applicatif** | Aucune surface d'attaque côté serveur métier |
| **Aucun cookie tiers** | Politique `SameSite=Strict` sur les cookies techniques |
| **Polices auto-hébergées** | Aucun appel vers des CDN tiers en production |

---

## 11. Analyse de risques (AIPD simplifiée)

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Divulgation du pseudonyme à un tiers | Très faible | Faible (pseudonyme non nominatif) | Données locales uniquement, HTTPS, pas de transmission |
| Accès non autorisé aux données de progression | Très faible | Faible (données non sensibles) | `sessionStorage` accessible uniquement depuis le même onglet |
| Perte de données de progression | Inévitable (fermeture du navigateur) | Non applicable (comportement attendu et documenté) | Information de l'utilisateur dans la politique de confidentialité |
| Persistance non souhaitée (PWA) | Nul | Nul (aucune donnée personnelle) | `sessionStorage` uniquement — effacé à la fermeture de l'onglet |
| Journalisation d'IPs complètes dans les logs serveur | **Éliminé** | — | Anonymisation Nginx avant écriture (`$remote_addr_anon`) + rétention 7 jours |

**Conclusion :** Le niveau de risque est **faible**. Une Analyse d'Impact sur la Protection des Données (AIPD) complète n'est pas requise au sens de l'article 35 du RGPD, compte tenu de l'absence de traitement à grande échelle, de l'absence de données sensibles, de la nature purement locale du stockage applicatif et de l'anonymisation des logs serveur.

---

## 12. Conformité RGPD — synthèse

| Critère | Statut |
|---|---|
| Minimisation des données | ✅ Seules les données strictement nécessaires au fonctionnement sont collectées |
| Limitation des finalités | ✅ Usage exclusivement pédagogique / fonctionnel |
| Limitation de la durée de conservation | ✅ Session unique (fermeture navigateur) + logs Nginx supprimés à 7 jours |
| Intégrité et confidentialité | ✅ HTTPS, en-têtes de sécurité, anonymisation des IPs en logs, aucun tiers applicatif |
| Transparence | ✅ Politique de confidentialité affichée dans l'application |
| Droits des personnes | ✅ Exercice direct via le navigateur |
| Pas de transfert hors UE | ✅ Aucun transfert de données utilisateur vers des tiers |

---

*Document établi sur la base de l'analyse du code source de l'application (version mai 2026). À mettre à jour en cas d'évolution de l'architecture ou des mécanismes de stockage.*
