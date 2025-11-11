# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package files and install dependencies first
COPY package*.json ./
RUN npm install

# Copy the rest of your project files
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the app directly using node and server.js
CMD ["node", "server.js"]
