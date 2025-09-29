# Etapa 1: build del frontend con Vite
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: producción con Node + Express
FROM node:20-alpine AS runner
WORKDIR /app

# Copiar dependencias necesarias
COPY package*.json ./
RUN npm install --only=production

# Copiar build y servidor
COPY --from=builder /app/dist ./dist
COPY server.js ./

EXPOSE 3000
CMD ["node", "server.js"]