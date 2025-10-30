#!/bin/bash
# CSS Auto-Watch Script
# This will automatically rebuild your CSS whenever you make changes

echo "🎨 Starting Tailwind CSS Watch Mode..."
echo "✨ Your CSS will automatically rebuild when you edit input.css or tailwind.config.js"
echo "🛑 Press Ctrl+C to stop"
echo ""

npx tailwindcss -i ./src/styles/input.css -o ./public/styles.css --watch
