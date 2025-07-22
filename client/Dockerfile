# ==============================
# Stage 1: Build the application
# ==============================
FROM node:20-slim AS build

# Set working directory
WORKDIR /app

COPY tsconfig.json ./

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY client .

# Build the app for production
RUN npm run build


# ==============================
# Stage 2: Serve with Nginx
# ==============================
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy build output from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]

