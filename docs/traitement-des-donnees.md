# Fiche de traitement des données — Le crash de Yandel

**Application :** Le crash de Yandel — escape game éducatif web  
**Public visé :** Élèves de 6ᵉ et 5ᵉ  
**Nature :** Application web progressive (PWA), frontend uniquement, sans backend métier  
**Date de rédaction :** Mai 2026

---

## 1. Résumé exécutif

L'application **ne crée aucun compte** et **n'envoie aucune donnée de jeu vers un serveur applicatif** (pas de base de données, pas d'API métier). Les seules informations traitées sont :

- un **pseudonyme** saisi librement à l'accueil (**obligatoire pour démarrer**, non vérifié, peut être fictif, stocké localement) ;
- des **données techniques de session** (progression, inventaire, préférences d'accessibilité, marqueurs d'interface) stockées dans le **`sessionStorage`** du navigateur ;
- les **échanges HTTP** habituels avec le serveur d'hébergement (pages et médias statiques).

Aucun nom, prénom, date de naissance, identifiant scolaire (INE), adresse e-mail ou numéro de téléphone n'est demandé. L'élève peut choisir un pseudonyme fictif ; s'il saisit volontairement son prénom, cette information reste **uniquement dans le navigateur** et n'est jamais transmise au serveur.

En usage normal (navigateur web), les données de session sont **effacées à la fermeture de l'onglet ou du navigateur**. L'action **« Nouvelle partie »** remet à zéro l'intégralité des données de session applicatives (progression, inventaire, indices, préférences, pseudonyme, marqueur PWA) sans fermer l'onglet (voir §5.9).

Les logs du serveur web (Nginx) contiennent des adresses IP **anonymisées** avant écriture (dernier octet tronqué) et sont supprimés après 7 jours.

L'**audiodescription** (optionnelle) s'appuie sur l'API **Web Speech** du navigateur : le texte lu peut, selon l'appareil et le navigateur, être synthétisé localement ou via un service cloud du fabricant (Google, Microsoft, Apple, etc.) — sans envoi par le code de l'application lui-même (voir §5.10 et §8).

---

## 2. Responsables et acteurs

| Rôle | Entité | Détail |
|---|---|---|
| **Éditeur / responsable de la publication** | MK Team building | 5, boulevard Aristide Briand, 91450 Soisy-sur-Seine — SIRET 849 862 933 00025 — [mk-teambuilding.com](https://mk-teambuilding.com) |
| **Responsable de traitement (données applicatives)** | MK Team building *(à confirmer contractuellement)* | Données stockées dans le navigateur (§5) ; aucun traitement centralisé côté serveur applicatif |
| **Contact DPO / référent RGPD** | *(à compléter)* | Coordonnées à publier avant mise en production scolaire nationale |
| **Hébergeur infrastructure (VPS)** | OVHcloud SAS | 2 rue Kellermann, 59100 Roubaix — [ovhcloud.com](https://www.ovhcloud.com/fr/) |
| **Responsable de traitement (logs serveur)** | MK Team building *(opérateur du VPS — à confirmer)* | Logs Nginx anonymisés (§8.1) |

> Les mentions ci-dessus reprennent les informations affichées dans l'application (`MentionsLegalesModal`). Seul le **contact DPO / référent RGPD** reste à compléter avant présentation au ministère.

---

## 3. Finalité du traitement

Le traitement des données a pour **seule finalité** de permettre le fonctionnement du jeu : validation du démarrage via pseudonyme, maintien de la progression pédagogique et mémorisation des préférences d'accessibilité le temps d'une session de jeu.

Il n'existe **aucune finalité secondaire** (analyse comportementale, marketing, profilage, partage avec des tiers).

---

## 4. Base légale

| Catégorie | Base légale (RGPD art. 6) |
|---|---|
| Pseudonyme | **Consentement de fait** — saisi volontairement par l'élève avant de jouer ; information minimale, stockée localement |
| Données de progression et préférences | **Intérêt légitime** — nécessaire au bon fonctionnement du service éducatif demandé par l'utilisateur |
| Audiodescription (Web Speech) | **Consentement de fait** — activation volontaire ; finalité d'accessibilité |
| Logs serveur (IP anonymisée, user-agent, URL) | **Intérêt légitime** — nécessaire à la sécurité et à la disponibilité du service |

---

## 5. Données traitées — inventaire complet

### 5.1 Pseudonyme du joueur

| Attribut | Détail |
|---|---|
| **Nature** | Chaîne de caractères saisie librement par l'élève (texte libre) |
| **Exemples** | « SuperYandel », « Joueur42 » |
| **Contraintes** | Minimum 1 caractère (après sanitisation) pour démarrer ; maximum 20 caractères ; les caractères `< > " '` sont automatiquement supprimés (prévention XSS) |
| **Clé de stockage** | `playerPseudo` |
| **Lieu de stockage** | `sessionStorage` du navigateur |
| **Durée** | Jusqu'à fermeture de l'onglet ou du navigateur |
| **Transmission** | Aucune — reste dans le navigateur |
| **Remarque** | La saisie est **obligatoire pour lancer une partie**, mais l'élève n'est pas obligé d'utiliser son vrai prénom : tout pseudonyme fictif est accepté. Le pseudonyme **n'est pas affiché** ailleurs dans le jeu (il sert uniquement à valider le démarrage à l'accueil) et **n'est jamais transmis** au serveur |

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
| **Exemples** | `{ collectedPieces: ["piece-1-1", "piece-1-2"], fusedPieces: ["fused-1"], placedOnRaft: [1] }` |
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
| **Remarque** | L'invite réapparaît à chaque nouvelle session. Ne contient aucune information personnelle. Entièrement optionnel (déclenché si l'élève clique sur « Plus tard » ou « J'ai compris » sur iOS). |

---

### 5.9 Réinitialisation « Nouvelle partie »

L'action **Nouvelle partie** (menu Paramètres de la carte de l'île) appelle `resetGameSession()` (`lib/resetGameSession.ts`), qui remet à zéro tous les stores Zustand persistés et supprime les clés `sessionStorage` hors persist (`playerPseudo`, `pwa-install-dismissed`). Elle redirige vers l'accueil et **redéclenche** le workflow d'introduction accessibilité (AD + DYS + écran narratif).

| Donnée | Effacée par « Nouvelle partie » ? |
|---|---|
| Progression (`escape_game_progress`) | Oui |
| Inventaire (`escape_game_inventory`) | Oui |
| Indices consultés (`escape_game_hints`) | Oui |
| Préférences AD/DYS | Oui |
| État UI (`escape_game_ui`, badges « Nouveau », outro radeau) | Oui |
| Pseudonyme (`playerPseudo`) | Oui |
| Marqueur PWA (`pwa-install-dismissed`) | Oui |

Pour un effacement complet sans passer par le menu, l'utilisateur peut aussi fermer l'onglet ou vider les données de navigation du site.

---

### 5.10 Audiodescription (API Web Speech)

| Attribut | Détail |
|---|---|
| **Nature** | Synthèse vocale des textes affichés à l'écran (consignes, questions, narration) lorsque l'élève active l'audiodescription |
| **Technologie** | API native `speechSynthesis` du navigateur (`lib/accessibility/audioDescription.ts`) |
| **Données concernées** | Textes pédagogiques lus à voix haute (contenus déjà visibles à l'écran) — **pas** le pseudonyme, **pas** les réponses saisies dans les mini-jeux |
| **Stockage** | Aucun enregistrement audio ; traitement en temps réel uniquement |
| **Transmission** | Le **code de l'application** n'envoie aucune requête HTTP dédiée à un service de synthèse vocale. En revanche, selon le navigateur et l'OS, la voix sélectionnée peut être **locale** (`localService: true`) ou **cloud** (`localService: false`, ex. voix « Online » / « Neural » Google ou Microsoft) : dans ce cas, le **navigateur ou le système d'exploitation** peut transmettre le texte à son fournisseur pour générer l'audio |
| **Contrôle utilisateur** | Fonctionnalité **optionnelle** ; activable/désactivable à l'accueil et dans Paramètres ; vitesse de lecture réglable (0,5× à 2×) |
| **Base légale** | Consentement de fait (activation volontaire) + intérêt légitime (accessibilité scolaire) |

---

### 5.11 Avertissement de fermeture d'onglet

| Attribut | Détail |
|---|---|
| **Nature** | Message natif du navigateur affiché lors d'une tentative de fermeture d'onglet ou de navigation hors site alors qu'une partie est en cours |
| **Technologie** | Événement `beforeunload` (`components/ui/BeforeUnloadWarning.tsx`, `lib/navigation/unloadWarning.ts`) |
| **Condition d'affichage** | Une mission est en cours (`currentMissionId` renseigné) ou au moins une étape est complétée |
| **Données concernées** | Aucune — aucune information n'est enregistrée ni transmise ; il s'agit uniquement d'avertir l'utilisateur que la session `sessionStorage` sera perdue |
| **Contrôle utilisateur** | L'avertissement n'apparaît pas lors d'une navigation interne (liens du jeu, bouton « Nouvelle partie ») |

---

## 6. Récapitulatif des mécanismes de stockage

| Mécanisme | Données stockées | Durée de vie |
|---|---|---|
| `sessionStorage` | Pseudonyme, progression, inventaire, indices, préférences d'accessibilité, état UI (dont `raftOutroCompleted`), marqueur de refus PWA | Effacé à la fermeture de l'onglet ou du navigateur *(en mode PWA installée, la persistance peut durer tant que le processus navigateur reste actif — voir §11)* |
| `localStorage` | Aucune en production *(des utilitaires existent dans `lib/storage/localStorage.ts` mais ne sont pas appelés par l'application)* | — |
| Cookies | Aucun cookie applicatif *(des utilitaires existent dans `lib/storage/cookieStorage.ts` mais ne sont pas appelés)* | — |
| Cache navigateur / PWA | Fichiers statiques (HTML, JS, CSS, images, polices) mis en cache par le navigateur selon les en-têtes HTTP. Un `manifest.json` permet l'installation PWA, mais **aucun service worker** n'est enregistré par l'application (pas de cache offline applicatif, pas de données de jeu dans le cache) | Selon le navigateur ; pas de données de jeu dans le cache |
| Serveur / base de données | Aucune | — |
| Logs Nginx (VPS) | IP anonymisée, user-agent, URL, code HTTP, horodatage | 7 jours (logrotate) |

> **Note technique :** Les polices de caractères (Baloo 2, Lexend, Comic Neue pour le style BD) sont téléchargées et auto-hébergées lors de la compilation du projet grâce à `next/font/google`. En production, **aucune requête n'est envoyée vers les serveurs Google** à l'utilisation du jeu.

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
- Traceurs publicitaires ou réseaux sociaux

---

## 8. Tiers destinataires

| Tiers | Nature des échanges | Données transmises |
|---|---|---|
| **OVHcloud (hébergement VPS)** | Échanges HTTP(S) : téléchargement des pages et médias statiques | Logs serveur : adresse IP **anonymisée** (voir §8.1), user-agent, URL, horodatage — **pas** le contenu du `sessionStorage` |
| **Fabricant du navigateur / OS** *(audiodescription uniquement, si voix cloud)* | Synthèse vocale via API Web Speech | Textes pédagogiques lus à voix haute, selon la voix disponible sur l'appareil — **hors contrôle direct de l'application** |
| **Tiers applicatifs intégrés** | Aucun (pas d'analytics, pas de SDK tiers, pas de CDN externe en production) | Aucune |

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

- **Droit d'accès, de rectification, d'effacement :** l'élève (ou son représentant légal) peut exercer ces droits directement depuis les paramètres du navigateur (« Effacer les données de navigation » / « Vider le cache »), via l'action **« Nouvelle partie »** (menu Paramètres, voir §5.9), ou en fermant l'onglet ou le navigateur (effacement automatique de l'intégralité des données).
- **Portabilité :** non applicable (données non transmises à un système central).

---

## 10. Mesures de sécurité

> Les en-têtes HTTP et le HTTPS ci-dessous sont appliqués **en production par Nginx** (`deploy/nginx/nginx.conf`), pas par l'application Next.js elle-même. Un build local servi via `npx serve out` n'inclut pas ces en-têtes.

| Mesure | Description |
|---|---|
| **Sanitisation du pseudo** | Suppression des caractères `< > " '` et limitation à 20 caractères |
| **En-têtes HTTP de sécurité (Nginx, production)** | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection`, `Content-Security-Policy`, `Permissions-Policy` (caméra, micro, géolocalisation interdits) |
| **HTTPS obligatoire en production (Nginx)** | Redirection HTTP → HTTPS ; `Strict-Transport-Security` (HSTS) activé |
| **Anonymisation des logs Nginx** | Les adresses IP sont tronquées (dernier octet → `0`) avant toute écriture dans les fichiers de log. Aucune IP complète n'est jamais stockée sur le serveur. |
| **Rétention courte des logs** | Suppression automatique des logs après 7 jours via `logrotate`. |
| **Pas de backend applicatif** | Aucune surface d'attaque côté serveur métier |
| **Aucun cookie applicatif** | Aucun cookie n'est posé par l'application en production |
| **Polices auto-hébergées** | Baloo 2, Lexend et Comic Neue embarquées via `next/font` à la compilation — aucun appel vers `fonts.googleapis.com` en production |
| **Content-Security-Policy (Nginx, production)** | `connect-src 'self'` — empêche les requêtes réseau initiées par l'application vers des domaines tiers |

---

## 11. Analyse de risques (AIPD simplifiée)

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Divulgation du pseudonyme à un tiers | Très faible | Faible (pseudonyme non nominatif) | Données locales uniquement, HTTPS, pas de transmission |
| Accès non autorisé aux données de progression | Très faible | Faible (données non sensibles) | `sessionStorage` accessible uniquement depuis le même onglet |
| Perte de données de progression | Inévitable (fermeture du navigateur) | Non applicable (comportement attendu et documenté) | Avertissement `beforeunload` en cours de partie (§5.11) ; information dans la politique de confidentialité |
| Persistance du `sessionStorage` en PWA installée | Faible | Faible | Données non transmises au serveur ; effacement à la fermeture du processus navigateur ou via « Effacer les données du site » |
| Voix cloud Web Speech (audiodescription) | Faible | Faible | Fonctionnalité optionnelle ; textes déjà visibles à l'écran ; dépend du navigateur/OS (§5.10) |
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
| Transparence | ✅ Politique de confidentialité affichée dans l'application (`PolitiqueConfidentialiteModal`, version synthétique) ; présente fiche technique complète pour audit |
| Droits des personnes | ✅ Exercice direct via le navigateur |
| Pas de transfert hors UE par l'application | ✅ Aucune requête applicative vers un tiers ; hébergement OVH (France) |
| Transferts éventuels via navigateur (voix cloud TTS) | ⚠️ Dépend de l'appareil — documenté §5.10 ; fonctionnalité optionnelle |

---

*Document établi sur la base de l'analyse du code source de l'application (version mai 2026). Dernière révision : mai 2026 — alignement code ↔ documentation (pseudo obligatoire, avertissement beforeunload, en-têtes Nginx, absence de service worker). À mettre à jour en cas d'évolution de l'architecture ou des mécanismes de stockage.*
