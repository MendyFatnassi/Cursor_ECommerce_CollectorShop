# Collector Shop Platform

Documentation projet collectorShop

## Prérequis

- **Java 21** (JDK 21)
- **Maven 3.9+**
- **Node.js 20+**
- **npm** (inclus avec Node.js)

## Lancement en mode local

### Option 1 : Lancement manuel (recommandé pour le développement)

#### 1. Backend (Spring Boot)

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances et lancer l'application
mvn spring-boot:run
```

Le backend sera accessible sur : **http://localhost:8080**

- API REST : http://localhost:8080/api
- H2 Console : http://localhost:8080/h2-console
- Actuator : http://localhost:8080/actuator

#### 2. Frontend (React/Vite)

Ouvrir un **nouveau terminal** :

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances (première fois uniquement)
npm install

# Lancer le serveur de développement
npm run dev
```

Le frontend sera accessible sur : **http://localhost:8080**

> **Note** : Le frontend et le backend utilisent le même port (8080). Le frontend proxy les requêtes `/api` vers le backend automatiquement grâce à la configuration Vite.

### Option 2 : Lancement avec Docker

```bash
# À la racine du projet
docker-compose up
```

- Backend : http://localhost:8082
- Frontend : http://localhost:8081

## Commandes utiles

### Backend

```bash
cd backend

# Compiler le projet
mvn compile

# Exécuter les tests
mvn test

# Créer le JAR
mvn package

# Nettoyer et reconstruire
mvn clean install
```

### Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# Prévisualiser le build de production
npm run preview

# Exécuter les tests (lint)
npm test

# Linter le code
npm run lint
```

## Structure du projet

```
projetTestCursorCube3/
├── backend/          # Backend Spring Boot (Java 21)
│   ├── src/
│   └── pom.xml
├── frontend/         # Frontend React + Vite + TypeScript
│   ├── src/
│   ├── config/
│   └── package.json
└── docker-compose.yml # Configuration Docker
```

## Configuration

### Backend

- Port : 8080
- Base de données : H2 (en mémoire)
- Configuration : `backend/src/main/resources/application.yml`

### Frontend

- Port : 8080 (développement)
- Proxy API : `/api` → `http://localhost:8080`
- Configuration : `frontend/config/vite.config.ts`

## Dépannage

### Port 8080 déjà utilisé

Si le port 8080 est déjà utilisé, modifiez :

**Backend** : `application.yml`
```yaml
server:
  port: 8081
```

**Frontend** : `config/vite.config.ts`
```typescript
server: {
  port: 3000,  // Changer le port
  // ...
}
```

### Erreur Java version

Assurez-vous d'avoir Java 21 installé :
```bash
java -version
```

### Erreur Node.js

Assurez-vous d'avoir Node.js 20+ :
```bash
node -version
```

## CI/CD

Le projet utilise GitHub Actions pour :
- **CI** : Tests backend (Maven) et frontend (ESLint)
- **CD** : Build backend et frontend

Voir `.github/workflows/github-actions.yml`
