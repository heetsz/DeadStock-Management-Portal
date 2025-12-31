@echo off
REM Start script for frontend (Windows)

echo Starting Deadstock && Asset Management System Frontend...
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Start development server
echo Starting Next.js development server on http://localhost:3000
echo.
call npm run dev

