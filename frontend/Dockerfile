# Étape de construction
FROM node:16-alpine AS build

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci --only=production

# Copie du code source
COPY . .

# Construction de l'application
RUN npm run build

# Étape de production avec Nginx
FROM nginx:alpine

# Copie des fichiers buildés
COPY --from=build /app/build /usr/share/nginx/html

# Copie de la configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exposition du port
EXPOSE 80

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]