# Use a lightweight version of Node.js
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies first (caches this step)
COPY package*.json ./
RUN npm install

# Copy the rest of your backend code (server.js, the logs folder, and system_secrets.txt)
COPY . .

# Expose the port your Express server runs on
EXPOSE 4000

# Start the challenge
CMD ["node", "server.js"]