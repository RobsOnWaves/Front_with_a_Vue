# Étape 1: Utilisez une image de base avec Node.js
FROM node:lts-alpine as build-stage

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le fichier `package.json` et `package-lock.json` (si disponible)
COPY package*.json ./

# Installez les dépendances du projet
RUN npm install

# Copiez les fichiers et dossiers du projet dans le conteneur
COPY . .

# Construisez l'application pour la production
RUN npm run build

# Étape 2: Servez l'application avec Nginx
FROM nginx:stable-alpine as production-stage

# Copiez les fichiers statiques de build depuis l'étape de build à Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Exposez le port 80 pour l'accès via HTTP
EXPOSE 80

# Lorsque le conteneur démarre, exécutez Nginx
CMD ["nginx", "-g", "daemon off;"]
