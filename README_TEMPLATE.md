# 📊 Application Full-Stack de Gestion d'Employés

[![Java](https://img.shields.io/badge/Java-11-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Description

Application complète de gestion d'employés et de départements avec une architecture full-stack moderne :
- **Backend** : Spring Boot 2.7.5 avec Java 11
- **Frontend** : React 18 avec Material-UI
- **Base de données** : MySQL 8.0
- **Containerisation** : Docker & Docker Compose

## ✨ Fonctionnalités

- ✅ Authentification JWT sécurisée
- ✅ Gestion complète des employés (CRUD)
- ✅ Gestion des départements (CRUD)
- ✅ Dashboard avec statistiques et graphiques
- ✅ Interface utilisateur responsive en français
- ✅ API REST documentée avec Swagger
- ✅ Containerisation Docker complète
- ✅ Healthchecks et monitoring

## 🏗️ Architecture

```
┌─────────────┐
│   React     │  Port 3000
│  Frontend   │
└──────┬──────┘
       │ HTTP/REST
┌──────▼──────┐
│ Spring Boot │  Port 8080
│   Backend   │
└──────┬──────┘
       │ JDBC
┌──────▼──────┐
│   MySQL     │  Port 3306
│  Database   │
└─────────────┘
```

## 🚀 Démarrage Rapide

### Prérequis

- **Docker** 20.10+ et **Docker Compose** 2.0+
- Ou **Java 11**, **Maven 3.6+**, **Node.js 18+**, **MySQL 8.0**

### Option 1 : Docker (Recommandé)

```bash
# Cloner le repository
git clone https://github.com/VOTRE_USERNAME/Gestion_employee.git
cd Gestion_employee

# Build et démarrage
chmod +x build.sh deploy.sh
./build.sh all
./deploy.sh start

# Ou avec Docker Compose
docker-compose up -d
```

**Accès :**
- Frontend : http://localhost:3000
- Backend API : http://localhost:8080/api
- Swagger UI : http://localhost:8080/swagger-ui.html

### Option 2 : Installation Locale

#### Backend

```bash
cd backend

# Configurer la base de données dans application.properties
# Importer database.sql dans MySQL

# Build et démarrage
mvn clean install
mvn spring-boot:run
```

#### Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Créer .env
echo "REACT_APP_API_URL=http://localhost:8080" > .env

# Démarrer
npm start
```

## 📁 Structure du Projet

```
Gestion_employee/
├── backend/                 # Application Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/       # Code source Java
│   │       └── resources/  # Configuration
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                # Application React
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── services/       # Services API
│   │   └── config/         # Configuration
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml       # Orchestration Docker
├── database.sql            # Script SQL initial
├── build.sh                # Script de build
├── deploy.sh               # Script de déploiement
└── README.md               # Ce fichier
```

## 🔧 Configuration

### Variables d'Environnement

**Backend** (`application.properties`) :
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/employee_management
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe
```

**Frontend** (`.env`) :
```env
REACT_APP_API_URL=http://localhost:8080
```

### Base de Données

```bash
# Importer le schéma
mysql -u root -p < database.sql

# Ou via phpMyAdmin (XAMPP)
# Importer database.sql
```

## 📚 API Documentation

Une fois le backend démarré, accédez à la documentation Swagger :
- **URL** : http://localhost:8080/swagger-ui.html
- **Endpoints disponibles** :
  - `/api/employees` - Gestion des employés
  - `/api/departments` - Gestion des départements
  - `/authenticate` - Authentification
  - `/register` - Inscription

## 🐳 Docker

### Commandes Utiles

```bash
# Build des images
docker-compose build

# Démarrer les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down

# Nettoyer (supprime volumes)
docker-compose down -v
```

Pour plus de détails, consultez [GUIDE_DOCKER.md](GUIDE_DOCKER.md)

## 🧪 Tests

```bash
# Backend (JUnit)
cd backend
mvn test

# Frontend (Jest - si configuré)
cd frontend
npm test
```

## 🛠️ Technologies Utilisées

### Backend
- **Java 11** - Langage de programmation
- **Spring Boot 2.7.5** - Framework
- **Spring Data JPA** - Persistance
- **Spring Security** - Sécurité
- **JWT** - Authentification
- **MySQL** - Base de données
- **Swagger/OpenAPI** - Documentation API

### Frontend
- **React 18.3** - Bibliothèque UI
- **Material-UI** - Composants
- **React Router** - Routing
- **Axios** - Client HTTP
- **Chart.js** - Graphiques
- **Tailwind CSS** - Styling

### DevOps
- **Docker** - Containerisation
- **Docker Compose** - Orchestration
- **Nginx** - Serveur web (production)

## 📝 Scripts Disponibles

- `build.sh` - Build des images Docker avec retry
- `deploy.sh` - Déploiement automatisé
- `prepare-images.sh` - Préparation images pour build hors ligne

## 🐛 Dépannage

### Problème de timeout npm
Les timeouts sont configurés dans le Dockerfile. Si problème persiste :
```bash
# Augmenter les timeouts dans frontend/Dockerfile
ENV NPM_CONFIG_FETCH_TIMEOUT=600000
```

### Problème de connexion MySQL
```bash
# Vérifier que MySQL est démarré
docker-compose ps mysql

# Vérifier les logs
docker-compose logs mysql
```

### Problème CORS
Vérifier la configuration CORS dans `backend/src/.../config/CorsConfig.java`

Pour plus de solutions, voir [GUIDE_DOCKER.md](GUIDE_DOCKER.md)

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👤 Auteur

**Steven Christophino**
- Email: stevenchristophino@gmail.com
- GitHub: [@votre-username](https://github.com/votre-username)

## 🙏 Remerciements

- Spring Boot Team
- React Team
- Material-UI Team
- Tous les contributeurs open-source

---

⭐ Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile !

📅 Dernière mise à jour : 2024-12-13

