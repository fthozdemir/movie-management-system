# Use the official Node.js 16 image as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock if you use yarn)
COPY package*.json ./
COPY prisma ./prisma/
# Install dependencies
RUN npm install --only=production
RUN npm install @nestjs/cli
# Copy the rest of your application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/src/main"]
