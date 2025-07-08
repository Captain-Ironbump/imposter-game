FROM node:18-alpine AS builder
#TODO: change to bun

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/out /usr/share/nginx/html
