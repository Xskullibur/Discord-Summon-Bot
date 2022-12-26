FROM node:19-bullseye-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# Use wildcard to ensure that both 'package.json' and 'package-lock.json' are copies
COPY package*.json ./

# Uncomment if building for development
RUN npm install

# Uncomment if building for production
# RUN npm ci --only=production

# Bundle app source files
COPY . .

# Bind app to port 8080
EXPOSE 3000

# Run the app
CMD ["node", "index.js"]
