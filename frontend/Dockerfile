# Dockerfile Frontend - React + Nginx
# Stage 1: Build Node
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
# Argument for API URL
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# Stage 2: Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
