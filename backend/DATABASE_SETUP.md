# Configuration de la Base de Données

Ce guide explique comment configurer une base de données persistante pour sauvegarder vos données.
Par défaut, le projet utilise **MySQL** en local via le profil `mysql`.

## Option 1 : H2 en mode fichier (Optionnel)

**Avantages :**
- ✅ Aucune installation requise
- ✅ Simple à configurer
- ✅ Les données sont sauvegardées dans un fichier
- ✅ Parfait pour le développement

**Configuration :**

1. **Activer le profil H2** (si vous ne voulez pas MySQL) :

```yaml
spring:
  profiles:
    active: h2-file
```

ou en variable d'environnement :

```bash
set SPRING_PROFILES_ACTIVE=h2-file
```

L'URL utilisée par défaut est :

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

## Option 2 : MySQL (Recommandé pour la persistance)

**Avantages :**
- ✅ Base de données populaire et largement supportée
- ✅ Facile à héberger en local ou via Docker
- ✅ Adaptée au développement et à la production

### Option 2A : Docker (recommandé)

Ce projet contient déjà une configuration Docker Compose avec MySQL. Il suffit de lancer :

```bash
docker compose up --build
```

La configuration est gérée par `application-mysql.yml` et le profil `mysql`.

Pour visualiser la base en interface web, un service CloudBeaver est aussi disponible :
- URL : http://localhost:8083
- Hôte MySQL : `mysql`
- Port : `3306`
- Base : `collectorshop`
- Utilisateur : `collectorshop_user`
- Mot de passe : `collectorshop_password`
Si vous obtenez l'erreur "Public Key Retrieval is not allowed", vous avez deux options :
- Ajouter la propriété `allowPublicKeyRetrieval=true` dans les paramètres de connexion CloudBeaver
- Ou ajouter la propriété `allowPublicKeyRetrieval=true` dans DBeaver (ou autre client local)

### Option 2B : Installation locale

1. **Installer MySQL** (via l'installeur officiel)
2. **Créer la base et l'utilisateur :**
   ```sql
   CREATE DATABASE collectorshop;
   CREATE USER 'collectorshop_user'@'%' IDENTIFIED BY 'collectorshop_password';
   GRANT ALL PRIVILEGES ON collectorshop.* TO 'collectorshop_user'@'%';
   FLUSH PRIVILEGES;
   ```
3. **Le profil `mysql` est le profil par défaut.** Si besoin, vous pouvez le forcer :
   ```yaml
   spring:
     profiles:
       active: mysql
   ```
   ou
   ```bash
   set SPRING_PROFILES_ACTIVE=mysql
   ```

---

## Vérification

### H2 Console (si H2 activé)
- URL : http://localhost:8080/h2-console
- JDBC URL : `jdbc:h2:file:./data/collector` (fichier) ou `jdbc:h2:mem:collector` (mémoire)
- Username : `sa`
- Password : (vide)

### MySQL
```bash
# Se connecter avec MySQL
mysql -h localhost -u collectorshop_user -p collectorshop

# Lister les tables
SHOW TABLES;
```

### CloudBeaver (interface web)
- URL : http://localhost:8083
- En cas d'erreur "Public Key Retrieval is not allowed", ajoutez `allowPublicKeyRetrieval=true`

---

## Migration des données

Si vous avez déjà des données en mémoire H2 et voulez les migrer :

1. Exporter depuis H2 Console :
   ```sql
   SCRIPT TO 'export.sql';
   ```

2. Importer dans MySQL :
   ```bash
   mysql -h localhost -u collectorshop_user -p collectorshop < export.sql
   ```

---

## Recommandations

- **Développement local** : Utilisez MySQL (Docker recommandé)
- **Option rapide** : Utilisez H2 en mode fichier (profil `h2-file`)
- **Tests** : Utilisez H2 en mémoire (profil `test`)

## Exécuter les tests avec H2

```bash
# PowerShell
$env:SPRING_PROFILES_ACTIVE="test"
mvn test
```

ou en une ligne :

```bash
mvn "-Dspring.profiles.active=test" test
```

Pour l'invite de commandes classique (cmd.exe) :

```bash
set SPRING_PROFILES_ACTIVE=test
mvn test
```
