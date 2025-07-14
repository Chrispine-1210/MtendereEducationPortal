# Base image for building frontend and backend
FROM node:20 AS builder

WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN npm install

# Build TypeScript backend and Vite frontend
RUN npm run build

# --- Production Image ---
FROM node:20-slim as production

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Use production env
ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "dist/index.js"]
