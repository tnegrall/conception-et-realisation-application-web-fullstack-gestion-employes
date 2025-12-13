# 🐳 Guide de Déploiement Docker - Application Gestion d'Employés

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Configuration initiale](#configuration-initiale)
3. [Résolution des problèmes réseau](#résolution-des-problèmes-réseau)
4. [Build des images](#build-des-images)
5. [Déploiement](#déploiement)
6. [Dépannage](#dépannage)
7. [Solutions de contournement](#solutions-de-contournement)

## 🔧 Prérequis

### Installation Docker

```bash
# Sur Debian/Ubuntu
sudo apt-get update
sudo apt-get install -y docker.io docker-compose

# Démarrer Docker
sudo systemctl start docker
sudo systemctl enable docker

# Vérifier l'installation
docker --version
docker-compose --version
```

### Configuration Docker Daemon (si problèmes réseau)

```bash
# Créer le répertoire de configuration
sudo mkdir -p /etc/docker

# Copier la configuration
sudo cp docker-daemon.json /etc/docker/daemon.json

# Redémarrer Docker
sudo systemctl restart docker
```

## 🌐 Configuration initiale

### 1. Configuration Proxy (si nécessaire)

Si vous êtes derrière un proxy, configurez Docker :

```bash
# Créer le répertoire systemd
sudo mkdir -p /etc/systemd/system/docker.service.d

# Créer le fichier de configuration proxy
sudo tee /etc/systemd/system/docker.service.d/http-proxy.conf <<EOF
[Service]
Environment="HTTP_PROXY=http://proxy.example.com:8080"
Environment="HTTPS_PROXY=http://proxy.example.com:8080"
Environment="NO_PROXY=localhost,127.0.0.1"
EOF

# Recharger et redémarrer
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 2. Configuration dans les Dockerfiles

Décommentez les lignes proxy dans :
- `backend/Dockerfile` (lignes 8-10)
- `frontend/Dockerfile` (lignes 7-9)

## 🏗️ Build des images

### Option 1: Script automatique (recommandé)

```bash
# Rendre le script exécutable
chmod +x build.sh

# Build toutes les images
./build.sh all

# Ou build individuel
./build.sh backend
./build.sh frontend
```

### Option 2: Build manuel

#### Backend

```bash
cd backend
docker build -t employee-backend:latest .
```

Si échec avec `eclipse-temurin`, utiliser `openjdk` :
```bash
# Modifier temporairement le Dockerfile
sed -i 's/eclipse-temurin:11-jdk/openjdk:11-jdk/g' Dockerfile
sed -i 's/eclipse-temurin:11-jre-jammy/openjdk:11-jre-slim/g' Dockerfile

docker build -t employee-backend:latest .
```

#### Frontend

```bash
cd frontend
docker build -t employee-frontend:latest .
```

Si échec avec `node:18-alpine`, utiliser `node:18` :
```bash
sed -i 's/node:18-alpine/node:18/g' Dockerfile
docker build -t employee-frontend:latest .
```

### Option 3: Build avec Docker Compose

```bash
# Build avec retry automatique
docker-compose build --no-cache

# Ou avec timeout augmenté
COMPOSE_HTTP_TIMEOUT=300 docker-compose build
```

## 🚀 Déploiement

### Option 1: Script automatique (recommandé)

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Démarrer les services
./deploy.sh start

# Voir les logs
./deploy.sh logs

# Arrêter
./deploy.sh stop

# Redémarrer
./deploy.sh restart

# Nettoyer tout
./deploy.sh clean
```

### Option 2: Docker Compose manuel

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Voir l'état
docker-compose ps

# Arrêter
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v
```

## 🔍 Dépannage

### Problème: Timeout TLS

**Symptômes:**
```
failed to do request: Head "https://registry-1.docker.io/...": net/http: TLS handshake timeout
```

**Solutions:**

1. **Augmenter les timeouts Docker:**
```bash
# Modifier /etc/docker/daemon.json
sudo nano /etc/docker/daemon.json

# Ajouter:
{
  "max-concurrent-downloads": 1,
  "max-concurrent-uploads": 1
}

sudo systemctl restart docker
```

2. **Utiliser un registry mirror:**
```bash
# Ajouter dans /etc/docker/daemon.json
{
  "registry-mirrors": ["https://mirror.example.com"]
}
```

3. **Télécharger les images manuellement:**
```bash
# Sur une machine avec accès internet
docker pull eclipse-temurin:11-jdk
docker save eclipse-temurin:11-jdk | gzip > temurin-11-jdk.tar.gz

# Transférer et charger sur la VM
docker load < temurin-11-jdk.tar.gz
```

### Problème: Images introuvables

**Symptômes:**
```
eclipse-temurin:11-jdk not found
```

**Solutions:**

1. **Utiliser les images alternatives (fallback):**
   - Backend: `openjdk:11-jdk` au lieu de `eclipse-temurin:11-jdk`
   - Frontend: `node:18` au lieu de `node:18-alpine`

2. **Vérifier la connexion:**
```bash
# Tester la connexion à Docker Hub
curl -I https://registry-1.docker.io/v2/

# Tester avec ping
ping registry-1.docker.io
```

3. **Utiliser des images locales:**
```bash
# Sauvegarder les images nécessaires
docker pull openjdk:11-jdk
docker pull node:18
docker pull mysql:8.0
docker pull nginx:alpine

# Créer un tar
docker save openjdk:11-jdk node:18 mysql:8.0 nginx:alpine | gzip > images.tar.gz
```

### Problème: Build échoue (Maven/NPM)

**Symptômes:**
```
npm ERR! network timeout
maven dependency download failed
```

**Solutions:**

1. **Augmenter les timeouts dans les Dockerfiles:**
   - Les timeouts sont déjà configurés dans les Dockerfiles
   - Vérifier que les variables d'environnement sont bien définies

2. **Utiliser un cache local:**
```bash
# Pour Maven, créer un volume de cache
docker volume create maven-cache

# Modifier docker-compose.yml pour utiliser le volume
volumes:
  maven-cache:
```

3. **Build hors ligne:**
```bash
# Télécharger toutes les dépendances d'abord
cd backend
mvn dependency:go-offline

cd ../frontend
npm install
```

### Problème: Connexion réseau entre conteneurs

**Symptômes:**
```
Backend ne peut pas se connecter à MySQL
```

**Solutions:**

1. **Vérifier le réseau Docker:**
```bash
docker network ls
docker network inspect employee-network
```

2. **Vérifier les healthchecks:**
```bash
docker-compose ps
# Tous les services doivent être "healthy"
```

3. **Tester la connexion manuellement:**
```bash
# Depuis le conteneur backend
docker exec -it employee-backend ping mysql

# Depuis le conteneur MySQL
docker exec -it employee-mysql mysql -uroot -prootpassword -e "SHOW DATABASES;"
```

## 🔄 Solutions de contournement

### Build local sans Docker Hub

1. **Préparer les images de base:**
```bash
# Sur une machine avec internet
./prepare-images.sh

# Transférer les fichiers .tar.gz sur la VM
# Charger les images
docker load < images-base.tar.gz
```

2. **Modifier les Dockerfiles pour utiliser les images locales:**
```bash
# Les images seront utilisées depuis le cache local
docker build --pull=false -t employee-backend:latest ./backend
```

### Utiliser un registry privé

1. **Configurer un registry local:**
```bash
docker run -d -p 5000:5000 --name registry registry:2
```

2. **Taguer et pousser les images:**
```bash
docker tag employee-backend:latest localhost:5000/employee-backend:latest
docker push localhost:5000/employee-backend:latest
```

3. **Modifier docker-compose.yml:**
```yaml
backend:
  image: localhost:5000/employee-backend:latest
  # Supprimer la section build
```

## 📊 Vérification du déploiement

### Vérifier les services

```bash
# État des conteneurs
docker-compose ps

# Logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

### Tester les endpoints

```bash
# Backend healthcheck
curl http://localhost:8080/actuator/health

# Frontend
curl http://localhost:3000

# MySQL
docker exec -it employee-mysql mysql -uroot -prootpassword -e "USE employee_management; SHOW TABLES;"
```

### Accès à l'application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080/api
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **MySQL:** localhost:3306

## 🛠️ Commandes utiles

```bash
# Nettoyer les images non utilisées
docker system prune -a

# Voir l'utilisation des ressources
docker stats

# Inspecter un conteneur
docker inspect employee-backend

# Exécuter une commande dans un conteneur
docker exec -it employee-backend sh

# Voir les logs d'un conteneur
docker logs -f employee-backend

# Redémarrer un service
docker-compose restart backend
```

## 📝 Notes importantes

1. **Sécurité:** Les mots de passe par défaut dans `docker-compose.yml` doivent être changés en production
2. **Performance:** Ajustez les limites de ressources selon votre environnement
3. **Persistance:** Les données MySQL sont stockées dans un volume Docker
4. **Réseau:** Tous les services communiquent via le réseau Docker `employee-network`

## 🆘 Support

En cas de problème persistant:

1. Vérifier les logs: `docker-compose logs`
2. Vérifier les ressources: `docker stats`
3. Vérifier la configuration réseau: `docker network inspect employee-network`
4. Consulter la documentation Docker: https://docs.docker.com

---

**Auteur:** Steven Christophino  
**Email:** stevenchristophino@gmail.com

