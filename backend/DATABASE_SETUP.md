# Configuration de la Base de Données

Ce guide explique comment configurer une base de données persistante pour sauvegarder vos données.

## Option 1 : H2 en mode fichier (Recommandé pour le développement)

**Avantages :**
- ✅ Aucune installation requise
- ✅ Simple à configurer
- ✅ Les données sont sauvegardées dans un fichier
- ✅ Parfait pour le développement

**Configuration :**

1. **Modifier `application.yml`** pour utiliser le profil H2 fichier :

```yaml
spring:
  profiles:
    active: h2-file
```

Ou renommer `application-h2-file.yml` en `application.yml` et modifier l'URL :

```yaml
spring:
  datasource:
    url: jdbc:h2:file:./data/collector;AUTO_SERVER=TRUE;DB_CLOSE_DELAY=-1
```

2. **Créer le dossier de données** (optionnel, créé automatiquement) :
```bash
mkdir -p backend/data
```

3. **Redémarrer l'application**

**Emplacement des données :**
- Fichier : `backend/data/collector.mv.db`
- Console H2 : http://localhost:8080/h2-console
- JDBC URL : `jdbc:h2:file:./data/collector`

---

## Option 2 : PostgreSQL (Recommandé pour la production)

**Avantages :**
- ✅ Base de données robuste et performante
- ✅ Supporte les grandes quantités de données
- ✅ Idéal pour la production

### Installation de PostgreSQL

#### Windows :

1. **Télécharger PostgreSQL :**
   - Aller sur https://www.postgresql.org/download/windows/
   - Télécharger l'installateur

2. **Installer PostgreSQL :**
   - Exécuter l'installateur
   - Noter le mot de passe du superutilisateur `postgres`
   - Port par défaut : `5432`

3. **Créer la base de données :**
   ```sql
   -- Se connecter avec psql ou pgAdmin
   CREATE DATABASE collectorshop;
   CREATE USER collectorshop_user WITH PASSWORD 'collectorshop_password';
   GRANT ALL PRIVILEGES ON DATABASE collectorshop TO collectorshop_user;
   ```

#### Linux (Ubuntu/Debian) :

```bash
# Installer PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Démarrer le service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Créer la base de données
sudo -u postgres psql
```

Dans psql :
```sql
CREATE DATABASE collectorshop;
CREATE USER collectorshop_user WITH PASSWORD 'collectorshop_password';
GRANT ALL PRIVILEGES ON DATABASE collectorshop TO collectorshop_user;
\q
```

#### macOS :

```bash
# Installer avec Homebrew
brew install postgresql@15
brew services start postgresql@15

# Créer la base de données
createdb collectorshop
createuser collectorshop_user
```

### Configuration Spring Boot

1. **Décommenter la dépendance PostgreSQL dans `pom.xml` :**
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

2. **Activer le profil PostgreSQL dans `application.yml` :**
```yaml
spring:
  profiles:
    active: postgres
```

3. **Modifier les credentials dans `application-postgres.yml`** si nécessaire

4. **Redémarrer l'application**

---

## Option 3 : Docker avec PostgreSQL

**Avantages :**
- ✅ Pas besoin d'installer PostgreSQL localement
- ✅ Isolation complète
- ✅ Facile à démarrer/arrêter

### Configuration Docker

1. **Créer un fichier `docker-compose.db.yml` :**
```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: collectorshop-db
    environment:
      POSTGRES_DB: collectorshop
      POSTGRES_USER: collectorshop_user
      POSTGRES_PASSWORD: collectorshop_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

2. **Démarrer PostgreSQL :**
```bash
docker-compose -f docker-compose.db.yml up -d
```

3. **Configurer Spring Boot** comme dans l'Option 2

---

## Vérification

### H2 Console (si H2 activé)
- URL : http://localhost:8080/h2-console
- JDBC URL : `jdbc:h2:file:./data/collector` (fichier) ou `jdbc:h2:mem:collector` (mémoire)
- Username : `sa`
- Password : (vide)

### PostgreSQL
```bash
# Se connecter avec psql
psql -h localhost -U collectorshop_user -d collectorshop

# Lister les tables
\dt

# Voir les utilisateurs
SELECT * FROM users;
```

---

## Migration des données

Si vous avez déjà des données en mémoire H2 et voulez les migrer :

1. Exporter depuis H2 Console :
   ```sql
   SCRIPT TO 'export.sql';
   ```

2. Importer dans PostgreSQL :
   ```bash
   psql -h localhost -U collectorshop_user -d collectorshop -f export.sql
   ```

---

## Recommandations

- **Développement** : Utilisez H2 en mode fichier
- **Production** : Utilisez PostgreSQL
- **Tests** : Utilisez H2 en mémoire
