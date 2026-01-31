# Tests et couverture

## Objectifs de couverture

- Code métier : **≥ 80%** (couverture de lignes)
- Infrastructure : **≥ 60%** (couverture de lignes)

Ces seuils visent à réduire les régressions et à rendre les évolutions plus sûres.

---

## Backend (Spring Boot / JaCoCo)

La couverture est vérifiée automatiquement avec JaCoCo pendant `mvn verify`.

### Commande

```bash
mvn verify
```

### Périmètre

**Code métier (80%) :**
- `com.collectorshop.admin`
- `com.collectorshop.auth`
- `com.collectorshop.chat`
- `com.collectorshop.listing`
- `com.collectorshop.notification`
- `com.collectorshop.portal`
- `com.collectorshop.shared.model`
- `com.collectorshop.store`
- `com.collectorshop.user`

**Infrastructure (60%) :**
- `com.collectorshop.config`
- `com.collectorshop.CollectorShopApplication`
- `com.collectorshop.auth.AuthTokenFilter`
- `com.collectorshop.shared.FraudWebhookGateway`

Pour ajuster les seuils ou les périmètres, modifiez `backend/pom.xml`.

---

## Frontend (Vite / Vitest)

La couverture est vérifiée en deux passes : **métier** puis **infrastructure**.

### Commande

```bash
npm run test:coverage
```

### Périmètre

**Code métier (80%) :**
- `src/components/**`
- `src/App.tsx`

**Infrastructure (60%) :**
- `src/api/**`
- `src/store/**`
- `src/main.tsx`

La configuration se trouve dans `frontend/config/vite.config.ts`.
