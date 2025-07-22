FROM node:20-slim AS build

# Set working directory to /app/client
WORKDIR /app/client

# Copy root tsconfig.json to /app/tsconfig.json
COPY tsconfig.json /app/tsconfig.json

# Copy client package.json files
COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy client source files
COPY client .

# Build the app
RUN npm run build


# ==============================
# Stage 2: Serve with Nginx
# ==============================
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy build output from previous stage
COPY --from=build /app/client/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

