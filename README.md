# Collector Shop Platform e-commerce

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
- Kafka : localhost:9092
- Prometheus : http://localhost:9090
- Grafana : http://localhost:3000 (admin/admin par défaut)

Le backend expose les métriques Prometheus sur :
- http://localhost:8082/actuator/prometheus

> **Note** : Vous pouvez changer le compte Grafana via `GRAFANA_ADMIN_USER` et `GRAFANA_ADMIN_PASSWORD`.
> En staging, les ports diffèrent (ex. Prometheus `19090`, Grafana `9300`, Kafka `19092`).
> Si prod + staging tournent sur le même VPS, utilisez un reverse proxy (voir plus bas).

### URLs par environnement

#### Local (dev)
- Grafana : http://localhost:3000
- Prometheus : http://localhost:9090
- Prometheus targets : http://localhost:9090/targets
- Backend metrics : http://localhost:8082/actuator/prometheus
- Kafka (broker) : localhost:9092
- Kafka Exporter (metrics) : http://localhost:9308/metrics

#### Staging
- Grafana : http://localhost:9300
- Prometheus : http://localhost:19090
- Prometheus targets : http://localhost:19090/targets
- Backend metrics : http://localhost:9082/actuator/prometheus
- Kafka (broker) : localhost:19092
- Kafka Exporter (metrics) : http://localhost:19308/metrics

#### Prod
- Grafana : http://localhost:3000
- Prometheus : http://localhost:9090
- Prometheus targets : http://localhost:9090/targets
- Backend metrics : http://localhost:8082/actuator/prometheus
- Kafka : non present en prod
- CloudBeaver : non present en prod

### Keycloak (prod + staging)

Deux instances Keycloak sont prévues (une par environnement).
Le `docker-compose.prod.yml` utilise PostgreSQL et `start`. Le staging reste en `start-dev` par simplicité.

#### DNS
- `auth.collectorshop.cloud` → IP du VPS (Keycloak prod)
- `auth.staging.collectorshop.cloud` → IP du VPS (Keycloak staging)

#### Caddy (reverse proxy HTTPS)
```
auth.collectorshop.cloud {
  reverse_proxy localhost:8080
}

auth.staging.collectorshop.cloud {
  reverse_proxy localhost:8180
}
```

#### Variables d'environnement
Dans `.env.prod` :
```
COLLECTOR_AUTH_MODE=keycloak
KEYCLOAK_ISSUER_URI=https://auth.collectorshop.cloud/realms/collectorshop
KEYCLOAK_HOSTNAME=auth.collectorshop.cloud
VITE_KEYCLOAK_URL=https://auth.collectorshop.cloud
VITE_KEYCLOAK_REALM=collectorshop
VITE_KEYCLOAK_CLIENT_ID=collector-shop-frontend
```

Dans `.env.staging` :
```
COLLECTOR_AUTH_MODE=keycloak
KEYCLOAK_ISSUER_URI=https://auth.staging.collectorshop.cloud/realms/collectorshop
KEYCLOAK_HOSTNAME=auth.staging.collectorshop.cloud
VITE_KEYCLOAK_URL=https://auth.staging.collectorshop.cloud
VITE_KEYCLOAK_REALM=collectorshop
VITE_KEYCLOAK_CLIENT_ID=collector-shop-frontend
```

#### Configuration Keycloak
- Créer le realm : `collectorshop`
- Créer un client public : `collector-shop-frontend`
- Activer `Valid Redirect URIs` :
  - `https://collectorshop.cloud/*`
  - `https://staging.collectorshop.cloud/*`
- Rôles à créer dans le realm : `BUYER`, `SELLER`, `ADMIN`
- Au premier login, le backend crée l'utilisateur local si besoin.
- Assurez-vous que le token contient l'email (`email` scope activé).

#### Kafka en mode KRaft (sans ZooKeeper)

Le cluster Kafka utilise `KAFKA_CLUSTER_ID` (défini dans `.env`).
Pour en générer un nouveau :

```bash
docker run --rm confluentinc/cp-kafka:7.6.1 kafka-storage random-uuid
```

Si vous passez de ZooKeeper à KRaft, supprimez le volume `kafka-data`.

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
