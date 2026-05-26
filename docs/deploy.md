# Déploiement — Le crash de Yandel

Application servie en **export statique** (dossier `out/`) derrière **Nginx** sur un VPS. Chaque push sur `main` déclenche un déploiement automatique via GitHub Actions.

---

## Architecture

```
push main → GitHub Actions (build) → rsync SSH → /var/www/le-crash-de-yandel → Nginx (HTTPS)
```

Pas de process Node en production. Les en-têtes de sécurité et l'anonymisation des logs IP sont gérés par Nginx.

---

## Setup VPS (une seule fois)

### 1. Prérequis

- VPS Ubuntu/Debian avec accès root ou sudo
- Nom de domaine pointant vers le VPS
- Ports 80 et 443 ouverts

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx logrotate
```

### 2. Nginx

Copier la config du dépôt :

```bash
sudo cp deploy/nginx/nginx.conf /etc/nginx/sites-available/le-crash-de-yandel
```

Remplacer `VOTRE_DOMAINE` par votre domaine (ex. `le-crash-de-yandel.example.fr`) dans le fichier.

```bash
sudo ln -sf /etc/nginx/sites-available/le-crash-de-yandel /etc/nginx/sites-enabled/
sudo nginx -t
```

### 3. Certificat TLS

```bash
sudo certbot --nginx -d VOTRE_DOMAINE
sudo systemctl reload nginx
```

### 4. Logrotate (rétention 7 jours, RGPD)

```bash
sudo cp deploy/logrotate/le-crash-de-yandel /etc/logrotate.d/
```

### 5. Dossier de déploiement

```bash
sudo mkdir -p /var/www/le-crash-de-yandel
sudo chown -R www-data:www-data /var/www/le-crash-de-yandel
```

### 6. Utilisateur SSH pour le CI

Créer un utilisateur dédié avec accès en écriture sur le dossier web :

```bash
sudo adduser --disabled-password deploy
sudo usermod -aG www-data deploy
sudo chown -R deploy:www-data /var/www/le-crash-de-yandel
sudo chmod -R g+w /var/www/le-crash-de-yandel
```

Générer une paire de clés **sur votre machine locale** (pas sur le VPS) :

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f deploy_key -N ""
```

Ajouter la clé publique sur le VPS :

```bash
sudo mkdir -p /home/deploy/.ssh
sudo bash -c 'cat deploy_key.pub >> /home/deploy/.ssh/authorized_keys'
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

Conserver `deploy_key` (clé privée) pour le secret GitHub. Ne jamais la committer.

---

## Secrets GitHub

Dans le dépôt : **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Valeur | Exemple |
|--------|--------|---------|
| `DEPLOY_HOST` | IP ou hostname du VPS | `123.45.67.89` |
| `DEPLOY_USER` | Utilisateur SSH | `deploy` |
| `DEPLOY_SSH_KEY` | Contenu complet de la clé privée | contenu de `deploy_key` |
| `DEPLOY_PATH` | Chemin cible (**avec** slash final) | `/var/www/le-crash-de-yandel/` |

---

## Déploiement automatique

À chaque **push sur `main`**, le workflow [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) :

1. Installe les dépendances (`npm ci`)
2. Build l'export statique (`npm run build` → dossier `out/`)
3. Synchronise `out/` vers le VPS via rsync (`--delete` pour retirer les anciens fichiers)

Suivre l'exécution dans l'onglet **Actions** du dépôt GitHub.

Aucun reload Nginx n'est nécessaire après un déploiement (fichiers statiques).

---

## Vérifications post-déploiement

- [ ] Le site répond en HTTPS
- [ ] Pages principales accessibles : `/`, `/carte-de-l-ile`, `/radeau`, `/journal-de-bord`
- [ ] Au moins un step : `/mission-1/step-1`
- [ ] En-têtes de sécurité présents (DevTools → Network → Response Headers)
- [ ] Logs Nginx : IPs anonymisées (`/var/log/nginx/le-crash-de-yandel-access.log`)

---

## Build local (test avant push)

```bash
npm ci
npm run build
npx serve out
```

Le dossier `out/` contient l'export statique complet (19 pages HTML + assets).

---

## Dépannage

| Problème | Piste |
|----------|-------|
| Workflow échoue au rsync | Vérifier les 4 secrets, la clé publique sur le VPS, les droits sur `DEPLOY_PATH` |
| 404 sur les routes step | Vérifier `try_files $uri $uri.html $uri/ /index.html;` dans nginx.conf |
| Certificat expiré | `sudo certbot renew` (cron certbot généralement déjà configuré) |
