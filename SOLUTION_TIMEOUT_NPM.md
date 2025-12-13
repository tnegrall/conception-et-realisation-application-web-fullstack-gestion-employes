# 🔧 Solution Problème Timeout NPM

## ❌ Erreur Rencontrée

```
npm ERR! code ERR_SOCKET_TIMEOUT
npm ERR! network Socket timeout
```

## ✅ Solutions Implémentées

### 1. Timeouts NPM Augmentés

Le Dockerfile frontend a été mis à jour avec :
- `NPM_CONFIG_FETCH_TIMEOUT=600000` (10 minutes au lieu de 5)
- `NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=30000` (30 secondes)
- `NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=300000` (5 minutes)
- `NPM_CONFIG_FETCH_RETRIES=10` (10 tentatives)
- `NPM_CONFIG_MAXSOCKETS=1` (une connexion à la fois)

### 2. Stratégie de Retry Robuste

Le Dockerfile utilise maintenant :
- Nettoyage du cache npm avant chaque tentative
- 4 tentatives avec délais progressifs (0s, 15s, 30s, 60s)
- Flags `--prefer-offline`, `--no-audit`, `--no-fund` pour accélérer

### 3. Configuration NPM Explicite

```dockerfile
RUN npm config set fetch-timeout 600000 && \
    npm config set fetch-retry-mintimeout 30000 && \
    npm config set fetch-retry-maxtimeout 300000 && \
    npm config set fetch-retries 10 && \
    npm config set maxsockets 1
```

## 🚀 Test de la Solution

```bash
# Rebuild avec le nouveau Dockerfile
docker-compose build frontend --no-cache

# Ou avec le script
./build.sh frontend
```

## 🔍 Si le Problème Persiste

### Option 1 : Utiliser npm install au lieu de npm ci

Si `npm ci` continue d'échouer, le Dockerfile utilise déjà `npm install` avec `--legacy-peer-deps`.

### Option 2 : Build Hors Ligne

```bash
# Sur une machine avec internet
cd frontend
npm install
npm run build

# Créer une image avec les node_modules
docker build -t employee-frontend:local .
```

### Option 3 : Utiliser un Registry Mirror

```bash
# Configurer npm pour utiliser un mirror
npm config set registry https://registry.npmmirror.com

# Ou dans le Dockerfile
RUN npm config set registry https://registry.npmmirror.com
```

### Option 4 : Proxy Configuration

Si vous êtes derrière un proxy, décommentez dans `frontend/Dockerfile` :
```dockerfile
ENV HTTP_PROXY=http://proxy.example.com:8080
ENV HTTPS_PROXY=http://proxy.example.com:8080
ENV NO_PROXY=localhost,127.0.0.1
```

## 📊 Vérification

Après le build, vérifiez :
```bash
# Voir les logs du build
docker-compose logs frontend

# Vérifier que l'image est créée
docker images | grep employee-frontend

# Tester l'image
docker run -p 3000:80 employee-frontend:latest
```

## ✅ Résultat Attendu

Le build devrait maintenant réussir même avec des connexions réseau lentes ou instables grâce aux :
- Timeouts augmentés (10 minutes)
- 10 tentatives de retry
- Délais progressifs entre les tentatives
- Nettoyage du cache entre les tentatives

