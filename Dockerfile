# Build stage
FROM node:24-alpine3.21 AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependence
RUN npm install

# Copy source code
COPY . .

# Expose port 
EXPOSE 3000

# Start the application
CMD ["npm", "start"]