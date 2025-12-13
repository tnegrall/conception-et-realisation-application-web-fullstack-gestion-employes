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

# Configuration npm pour éviter les timeouts
ENV NPM_CONFIG_FETCH_TIMEOUT=300000
ENV NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=20000
ENV NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=120000
ENV NPM_CONFIG_FETCH_RETRIES=5

# Installer wget pour healthcheck
RUN apk add --no-cache wget || echo "wget already installed"

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances d'abord (cache layer)
COPY package*.json ./

# Installer les dépendances avec retry
RUN npm install --legacy-peer-deps || \
    (sleep 10 && npm install --legacy-peer-deps) || \
    (sleep 20 && npm install --legacy-peer-deps) || \
    echo "Warning: Some dependencies may have failed"

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
