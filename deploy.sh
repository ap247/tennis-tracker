#!/bin/bash

# 🚀 Breakpoint Deployment Script

echo "🎾 Deploying Breakpoint Tennis Tracker..."

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "🔧 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is live at: https://tennis-tracker-558a4.web.app"
else
    echo "❌ Deployment failed!"
    exit 1
fi