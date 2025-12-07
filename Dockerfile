# Multi-stage Dockerfile for IT Asset Management System

# Stage 1: Build Frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Backend Setup
FROM node:22-alpine
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy backend files
COPY backend/ ./

# Copy built frontend files to backend public directory
COPY --from=frontend-build /app/client/dist ./public

# Create uploads directory for PM reports
RUN mkdir -p uploads/pm-reports

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]
