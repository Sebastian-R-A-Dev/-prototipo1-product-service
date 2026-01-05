# --- ETAPA 1: Construcción (Builder) ---
# Usamos una imagen de Node ligera
FROM node:20-alpine AS builder

# Creamos carpeta de trabajo
WORKDIR /app

# Copiamos solo los archivos de dependencias (para aprovechar caché)
COPY package*.json ./

# Instalamos TODAS las dependencias (incluyendo devDependencies para el build)
RUN npm install

# Copiamos el resto del código
COPY . .

# Construimos la app (crea la carpeta /dist)
RUN npm run build

# --- ETAPA 2: Ejecución (Runner) ---
# Empezamos desde cero con una imagen limpia
FROM node:20-alpine

WORKDIR /app

# Copiamos solo las dependencias de producción (más ligero)
COPY package*.json ./
RUN npm install --only=production

# Copiamos la carpeta 'dist' creada en la etapa anterior
COPY --from=builder /app/dist ./dist

# Exponemos el puerto
EXPOSE 3000

# Comando para iniciar la app
CMD ["node", "dist/main"]