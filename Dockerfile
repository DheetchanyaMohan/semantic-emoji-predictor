# Step 1: Build stage
FROM node:20 AS build

WORKDIR /app

# Use Node
# Install dependencies
COPY package*.json ./
RUN npm install

# Build and create /dist folder
# i.e. multi stage build
COPY . .
RUN npm run build

# Step 2: Serve stage
FROM nginx:alpine
# Use nginx - fast web server
# Serve static files from /dist

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]