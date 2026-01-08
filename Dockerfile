FROM node:24-bookworm

# Install system dependencies (ffmpeg for video processing)
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files for better caching
COPY package.json ./
COPY prisma ./prisma

# Install dependencies (npm install to generate package-lock.json)
RUN npm install && npm cache clean --force

# Copy application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start Next.js in development mode
CMD ["npm", "run", "dev"]
