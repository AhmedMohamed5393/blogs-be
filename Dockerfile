# Use Node.js 22.14 as the base image
FROM node:22.14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install rimraf globally before installing dependencies
RUN npm install -g npm@latest rimraf

# Install dependencies (skip prepare step)
RUN npm install --legacy-peer-deps --ignore-scripts

# Copy the Prisma schema file
COPY ./prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose the port your app runs on (change if needed)
EXPOSE 80

# Command to run your application
CMD [ "npm", "run", "start:dev" ]
