# 🚀 Guide de Démarrage Rapide Docker

## Installation Rapide (5 minutes)

### 1. Prérequis
```bash
# Installer Docker et Docker Compose
sudo apt-get update
sudo apt-get install -y docker.io docker-compose

# Démarrer Docker
sudo systemctl start docker
sudo systemctl enable docker

# Vérifier
docker --version
docker-compose --version
```

### 2. Build et Déploiement

```bash
# Option A: Scripts automatiques (recommandé)
chmod +x build.sh deploy.sh
./build.sh all
./deploy.sh start

# Option B: Docker Compose direct
docker-compose build
docker-compose up -d
```

### 3. Vérification

```bash
# Voir l'état
docker-compose ps

# Voir les logs
docker-compose logs -f

# Tester
curl http://localhost:8080/actuator/health
```

### 4. Accès

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8080
- **Swagger:** http://localhost:8080/swagger-ui.html

## En Cas de Problème

### Timeout TLS
```bash
# Utiliser les images alternatives
# Les Dockerfiles ont des fallbacks automatiques
./build.sh all
```

### Images introuvables
```bash
# Les scripts utilisent automatiquement les fallbacks
# Backend: openjdk au lieu de eclipse-temurin
# Frontend: node:18 au lieu de node:18-alpine
```

### Problème réseau
```bash
# Vérifier la configuration proxy dans les Dockerfiles
# Décommenter les lignes HTTP_PROXY si nécessaire
```

## Commandes Utiles

```bash
# Logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Redémarrer un service
docker-compose restart backend

# Arrêter tout
docker-compose down

# Nettoyer
docker-compose down -v
```

Pour plus de détails, voir `GUIDE_DOCKER.md`


