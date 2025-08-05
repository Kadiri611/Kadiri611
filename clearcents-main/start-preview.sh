#!/bin/bash

echo "🚀 Starting ClearCents Development Server..."
echo ""

# Kill any existing vite processes
echo "🔄 Stopping any existing development servers..."
pkill -f "vite" 2>/dev/null

# Start the development server
echo "📡 Starting development server..."
npm run dev &
DEV_PID=$!

# Wait a moment for the server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Open the preview
echo "🌐 Opening live preview..."
open preview.html

echo ""
echo "✅ Development server started!"
echo "📱 Live preview opened in your browser"
echo "🔄 The preview will update automatically as you edit files"
echo ""
echo "🔗 Direct server URLs:"
echo "   - http://localhost:8080"
echo "   - http://localhost:8081" 
echo "   - http://localhost:8082"
echo "   - http://localhost:8083"
echo "   - http://localhost:8084"
echo ""
echo "💡 Tips:"
echo "   - Edit files in src/ directory"
echo "   - Save files to see live updates"
echo "   - Use the port selector in the preview if needed"
echo ""
echo "🛑 To stop the server, press Ctrl+C"

# Wait for user to stop
wait $DEV_PID 