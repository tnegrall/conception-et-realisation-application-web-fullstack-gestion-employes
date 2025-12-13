# Dockerfile optimisé pour React avec fallbacks et retry
# Compatible avec environnements à accès réseau limité

# Stage 1: Build
FROM node:18-alpine AS build

# Fallback: Si node:18-alpine échoue, utiliser node:18
# FROM node:18 AS build

# Configuration pour proxy (décommentez si nécessaire)
# ENV HTTP_PROXY=http://proxy.example.com:8080
# ENV HTTPS_PROXY=http://proxy.example.com:8080
# ENV NO_PROXY=localhost,127.0.0.1

# Configuration npm pour éviter les timeouts (valeurs augmentées)
ENV NPM_CONFIG_FETCH_TIMEOUT=600000
ENV NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=30000
ENV NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=300000
ENV NPM_CONFIG_FETCH_RETRIES=10
ENV NPM_CONFIG_MAXSOCKETS=1
ENV NPM_CONFIG_PROGRESS=false
ENV NPM_CONFIG_PREFER_OFFLINE=false
ENV NPM_CONFIG_AUDIT=false
ENV NPM_CONFIG_FUND=false

# Installer wget pour healthcheck
RUN apk add --no-cache wget || echo "wget already installed"

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances d'abord (cache layer)
COPY package*.json ./

# Configurer npm registry et timeouts
RUN npm config set fetch-timeout 600000 && \
    npm config set fetch-retry-mintimeout 30000 && \
    npm config set fetch-retry-maxtimeout 300000 && \
    npm config set fetch-retries 10 && \
    npm config set maxsockets 1

# Installer les dépendances avec retry et stratégie robuste
RUN npm cache clean --force || true && \
    (npm install --legacy-peer-deps --prefer-offline --no-audit --no-fund || \
     (echo "Retry 1..." && sleep 15 && npm cache clean --force && npm install --legacy-peer-deps --prefer-offline --no-audit --no-fund) || \
     (echo "Retry 2..." && sleep 30 && npm cache clean --force && npm install --legacy-peer-deps --prefer-offline --no-audit --no-fund) || \
     (echo "Retry 3..." && sleep 60 && npm cache clean --force && npm install --legacy-peer-deps --prefer-offline --no-audit --no-fund) || \
     echo "Warning: Some dependencies may have failed, continuing...")

# Copier le code source
COPY . .

# Build de l'application
RUN npm run build || \
    (sleep 5 && npm run build) || \
    (sleep 10 && npm run build)

# Stage 2: Production avec nginx
FROM nginx:alpine

# Fallback: Si nginx:alpine échoue, utiliser nginx
# FROM nginx:latest

# Copier les fichiers buildés
COPY --from=build /app/build /usr/share/nginx/html

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
