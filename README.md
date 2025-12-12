# Application Full-Stack de Gestion d'Employés

Application fullstack de gestion d'employés avec React (frontend) et Spring Boot (backend).

## Structure du projet

```
projet/
├── frontend/          # Application React
├── backend/           # Application Spring Boot
├── database.sql       # Script SQL pour XAMPP/MySQL
├── schema.sql         # Schéma de base de données
├── README.md          # Ce fichier
└── .gitignore        # Fichiers à ignorer
```

## Prérequis

### Backend
- Java 11 ou supérieur
- Maven 3.6+
- XAMPP avec MySQL (ou MySQL standalone)
- MongoDB (optionnel)

### Frontend
- Node.js 14+ et npm

## Installation et démarrage

### Base de données (XAMPP)

1. Démarrer XAMPP et activer MySQL
2. Ouvrir phpMyAdmin (http://localhost/phpmyadmin)
3. Importer le fichier `database.sql` ou exécuter les commandes SQL dans l'onglet SQL

### Backend

1. Naviguer dans le dossier backend :
```bash
cd backend
```

2. Le fichier `src/main/resources/application.properties` est déjà configuré pour XAMPP :
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/employee_management?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
```

3. Installer les dépendances et démarrer le serveur :
```bash
mvn install
mvn spring-boot:run
```

Le backend sera accessible sur `http://localhost:8080`

### Frontend

1. Naviguer dans le dossier frontend :
```bash
cd frontend
```

2. Installer les dépendances :
```bash
npm install
```

3. Créer un fichier `.env` à la racine du dossier frontend :
```env
REACT_APP_API_URL=http://localhost:8080/api
```

4. Démarrer le serveur de développement :
```bash
npm start
```

Le frontend sera accessible sur `http://localhost:3000`

## Fonctionnalités

- Gestion des employés (CRUD)
- Gestion des départements (CRUD)
- Authentification utilisateur
- Dashboard avec statistiques
- Interface responsive en français

## Technologies utilisées

### Frontend
- React 18
- Material-UI
- React Router
- Axios
- Chart.js

### Backend
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT
- MySQL
- Swagger/OpenAPI

## API Documentation

Une fois le backend démarré, la documentation Swagger est disponible à :
`http://localhost:8080/swagger-ui.html`

## Contact

Pour toute question ou problème, contactez : stevenchristophino@gmail.com

## Licence

MIT
