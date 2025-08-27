# Stage 1: Build auf amd64 (Next.js Static Export)
FROM --platform=linux/amd64 node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Nginx Runtime (Multi-Arch kompatibel)
FROM nginx:alpine

# Static files aus dem Next.js Build kopieren
COPY --from=builder /app/out /usr/share/nginx/html

# Eigene nginx.conf einbinden
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
