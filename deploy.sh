#!/bin/bash

# Configuration
APP_DIR="/var/www/hka"
GIT_REPO="https://github.com/murat-kacar/HKA.git"

echo "🚀 Starting Deployment..."

# 1. Update Code
if [ -d "$APP_DIR" ]; then
    echo "📦 Pulling latest changes..."
    cd $APP_DIR
    git pull
else
    echo "📂 Cloning repository..."
    git clone $GIT_REPO $APP_DIR
    cd $APP_DIR
fi

# 2. Setup Environment
if [ ! -f .env ]; then
    echo "⚠️ .env file missing! Creating from example..."
    cp .env.example .env
    echo "Please edit .env file with production values."
    exit 1
fi

# 3. Build & Run
echo "🐳 Building and Starting Containers..."
docker-compose up -d --build

# 4. Migrations
echo "🗄️ Running Database Migrations..."
docker-compose exec -T app npx prisma db push

echo "✅ Deployment Complete!"
echo "🌍 Site should be live at http://$(curl -s ifconfig.me)"
