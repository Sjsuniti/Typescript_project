#!/bin/bash

echo "🚀 Starting MindCanvas Development Environment..."
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  Warning: MongoDB doesn't appear to be running."
    echo "   Please start MongoDB before continuing."
    echo "   You can start it with: brew services start mongodb-community"
    echo ""
fi

# Start backend server
echo "🔧 Starting Backend Server (Port 5000)..."
npm run dev:backend &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🎨 Starting Frontend Server (Port 3000)..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development servers started!"
echo "   Backend:  http://localhost:5000"
echo "   Frontend: http://localhost:3000"
echo "   Health:   http://localhost:5000/health"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping development servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped. Goodbye!"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
