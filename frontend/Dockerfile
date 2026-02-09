### Étape 1 : build frontend avec Node
FROM node:20-alpine AS build

# Dossier de travail directement sur le frontend
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json* ./

# Installer les dépendances (utilise npm ci si le lockfile existe, sinon npm install)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copier le reste du code frontend (y compris index.html, src, vite.config, etc.)
COPY . .

# Variables Vite pour Keycloak (build-time)
ARG VITE_KEYCLOAK_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_CLIENT_ID
ENV VITE_KEYCLOAK_URL=${VITE_KEYCLOAK_URL}
ENV VITE_KEYCLOAK_REALM=${VITE_KEYCLOAK_REALM}
ENV VITE_KEYCLOAK_CLIENT_ID=${VITE_KEYCLOAK_CLIENT_ID}

# Construire l'application pour la prod
RUN npm run build

### Étape 2 : image finale avec serveur web léger (nginx)
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
