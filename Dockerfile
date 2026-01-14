### Étape 1 : build frontend avec Node
FROM node:20-alpine AS build

# Dossier de travail directement sur le frontend
WORKDIR /app/frontend

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY frontend/package.json frontend/package-lock.json* ./

# Installer les dépendances (utilise npm ci si le lockfile existe, sinon npm install)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copier le reste du code frontend
COPY frontend/ .

# Construire l'application pour la prod
RUN npm run build

### Étape 2 : image finale avec serveur web léger (nginx)
FROM nginx:stable-alpine

# Supprimer la config par défaut et ajouter la nôtre pour une SPA (optionnel mais recommandé)
RUN rm /etc/nginx/conf.d/default.conf

COPY <<EOF /etc/nginx/conf.d/frontend.conf
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }

    location /assets/ {
        try_files \$uri =404;
    }
}
EOF

# Copier le build Vite dans nginx
COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

