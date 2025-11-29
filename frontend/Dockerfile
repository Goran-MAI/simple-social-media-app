# Build stage
FROM node:20 AS build
WORKDIR /app/frontend

# Copy package.json and lockfile
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Pass environment variable at build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy source code AND env together
COPY frontend/ ./

# Build production
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
