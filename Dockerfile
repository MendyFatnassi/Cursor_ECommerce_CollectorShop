### Étape 1 : build frontend avec Node
FROM node:20-alpine AS build

# Dossier de travail directement sur le frontend
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY frontend/package.json frontend/package-lock.json* ./

# Installer les dépendances (utilise npm ci si le lockfile existe, sinon npm install)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copier le reste du code frontend (y compris index.html, src, vite.config, etc.)
COPY frontend/ .

# Construire l'application pour la prod
RUN npm run build

### Étape 2 : image finale avec serveur web léger (nginx)
FROM nginx:stable-alpine

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

