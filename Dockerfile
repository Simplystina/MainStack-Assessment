# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy ts.config.json to the working directory
COPY tsconfig.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY src/ ./src/

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]
