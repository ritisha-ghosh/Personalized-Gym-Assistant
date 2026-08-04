# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Expose the Node backend port (e.g., 5000)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]