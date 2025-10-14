# Built docker image using minimal base image such as alpine
# Build stage
FROM node:24-alpine3.21 AS builder

# Set working directory
WORKDIR /app

# Copy package file
COPY package*.json ./

# Install dependence
RUN npm install

# Copy all other code
COPY . .

# Create non-root user and group
RUN addgroup -S team3 && adduser -S tempuser -G team3

# switch to non-root user
USER tempuser

# Expose port 
EXPOSE 3000

# Start the application
CMD ["npm", "start"]